import axios from "axios";
import { loadEnvFile } from "node:process";
loadEnvFile(".env");
const userID = process.env.USER_ID;
const apiToken = process.env.API_TOKEN;
const xClientId = userID + "-NightmareArmadillo";
import sendMessage from "./sendMessage.js";

const fetchData = async (url, customHeaders = {}, method = "get") => {
    try {
        if (method.toLowerCase() === "post") {
            const response = await axios.post(url, {}, {
                headers: {
                    "x-client": xClientId,
                    "x-api-user": userID,
                    "x-api-key": apiToken,
                    "Content-Type": "application/json",
                    ...customHeaders
                }
            });
            return response.data;
        } else {
            const response = await axios.get(url, {
                headers: {
                    "x-client": xClientId,
                    "x-api-user": userID,
                    "x-api-key": apiToken,
                    "Content-Type": "application/json",
                    ...customHeaders
                }
            });
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const perceptionGears = [
    "shield_armoire_springPetalUchiwa",
    "head_armoire_jesterCap",
    "armor_armoire_gildedKnightsPlate",
    "weapon_special_2"
]
const strengthGears = [
    "weapon_warrior_6",
    "armor_special_lunarWarriorArmor",
    "head_warrior_5",
    "shield_armoire_perchingFalcon"
]
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function changeGears(type) {
    const gears = type === "perception" ? perceptionGears : strengthGears;
    for (const gear of gears) {
        try {
            await fetchData(`https://habitica.com/api/v3/user/equip/equipped/${gear}`, {}, "post");
            await sendMessage(`Equipped ${gear}`);
        } catch (e) {
            await sendMessage(`Error equipping ${gear}: ${e.response?.data || e.message}`);
        }
        await sleep(2000);
    }
}

// await changeGears("strength");
async function castSpell(spellKey) {
    const data = await fetchData("https://habitica.com/api/v3/user", {}, "get");
    const mana = data.data.stats.mp;
    const maxMana = data.data.stats.maxMP;
    const spellCost = 10;
    const availableSpellsCount = Math.floor(mana / spellCost);
    await sendMessage(`Current Mana: ${mana}/${maxMana}. Casting ${spellKey} up to ${availableSpellsCount} time(s).`);
    if (availableSpellsCount === 0) {
        await sendMessage(`Not enough mana to cast ${spellKey}.`);
        return;
    }
    for (let i = 0; i < availableSpellsCount; i++) {
        try {
            await fetchData(`https://habitica.com/api/v3/user/class/cast/smash?targetId=39929afd-d6b3-40cf-977d-bbea9877be42`, {}, "post");
            console.log("Bradar everything is fine");
        } catch (e) {
            await sendMessage(`Error casting ${spellKey}: ${e.response?.data || e.message}`);
        }
        await sleep(30000);
    }
    await sendMessage(`Casting spells completed.`);
}
castSpell("smash");

function getInventoryInfo() {
    fetchData("https://habitica.com/api/v3/user?userFields=items", {}, "get").then(data => {
        console.log(Object.keys(data.data.items));
        console.log(data.data.items.gear);
    })
}

function getUserData() {
    fetchData("https://habitica.com/export/userdata.json", {}, "get").then(data => {
        console.log(data);
    })
}
