require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');  // додаємо express
const app = express();

// простий маршрут для пінгу
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

// порт, який видає Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

const token = process.env.BOT_TOKEN;
const adminIds = process.env.ADMIN_IDS.split(',');

const bot = new TelegramBot(token, { polling: true });

console.log('Бот запущено...');

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,
`💌 Привіт!
Це бот для пропозицій 🌸

Тут можна надсилати:
• ідеї для публікацій
• історії чи думки
• меми або фото
• питання до адміністраторів

👇 Просто напиши повідомлення:`
    );
});

bot.on('message', async (msg) => {
    if (!msg.text && !msg.photo) return;
    if (msg.text && msg.text.startsWith('/')) return;

    const userInfo =
`📩 Нова пропозиція від користувача:

Ім'я: ${msg.from.first_name || 'Невідомо'}
Username: @${msg.from.username || 'немає'}
ID: ${msg.from.id}`;

    for (let adminId of adminIds) {
        try {

            await bot.sendMessage(adminId, userInfo);

            if (msg.text) {
                await bot.sendMessage(adminId, msg.text);
            }

            if (msg.photo) {
                const photoId = msg.photo[msg.photo.length - 1].file_id;
                await bot.sendPhoto(adminId, photoId, {
                    caption: msg.caption || ''
                });
            }

        } catch (err) {
            console.log("Помилка:", err.message);
        }
    }

    bot.sendMessage(msg.chat.id, "✅ Повідомлення надіслано адміністраторам 💌");
});
