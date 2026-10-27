import { Api } from "node-telegram-bot-api";
import {loadEnvFile} from 'node:process';
loadEnvFile('.env');

export default async function sendMessage(text) {
    const api = new Api(process.env.TELEGRAM_BOT_TOKEN);
    await api.sendMessage({ chat_id: process.env.TELEGRAM_CHAT_ID, text: text });
}

