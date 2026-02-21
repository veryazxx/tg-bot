const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const adminIds = process.env.ADMIN_IDS.split(',');

const bot = new TelegramBot(token, { polling: true });

cbot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const from = msg.from;

  // Якщо користувач пише /start
  if (text === '/start') {
    bot.sendMessage(chatId, `💌 Привіт!
Це бот для пропозицій 🌸

Тут можна надсилати:
• ідеї для публікацій
• історії чи думки
• меми або фото
• питання до адміністраторів

👇 Просто напиши повідомлення:`);
    return; // зупиняємо подальшу обробку
  }

  // Всі інші повідомлення надсилаємо адміністраторам
  adminIds.forEach(adminId => {
    bot.sendMessage(adminId, `📩 Нова пропозиція від користувача:\n\nІм'я: ${from.first_name}\nUsername: @${from.username || "немає"}\nID: ${from.id}\n\nТекст:\n${text}`);
    bot.sendMessage(adminId, `Тільки текст: ${text}`);
  });

  bot.sendMessage(chatId, '✅ Ваше повідомлення надіслано адміністраторам!');
});