const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const adminIds = process.env.ADMIN_IDS.split(',');

const bot = new TelegramBot(token, { polling: true });

const app = express();
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

bot.on('message', (msg) => {
  const text = msg.text;
  const from = msg.from;

  adminIds.forEach(adminId => {
    bot.sendMessage(adminId, `📩 Нова пропозиція від користувача:\n\nІм'я: ${from.first_name}\nUsername: @${from.username || "немає"}\nID: ${from.id}\n\nТекст:\n${text}`);
    bot.sendMessage(adminId, `Тільки текст: ${text}`);
  });

  bot.sendMessage(msg.chat.id, '✅ Ваше повідомлення надіслано адміністраторам!');
});