import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });

const TELEGRAM_API = 'https://api.telegram.org/bot';

function getBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN || '';
}

function getChatId(): string {
  return process.env.TELEGRAM_CHAT_ID || '';
}

function formatP(price: number): string {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' сўм';
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function testIt() {
  const token = getBotToken();
  const chatId = getChatId();

  console.log("Token:", token ? 'Found' : 'Missing');
  console.log("ChatId:", chatId ? 'Found' : 'Missing');

  const message = `🆕 <b>Новый заказ!</b>

📋 <b>TEST-123</b>

👤 <b>Клиент:</b> ${escapeHtml('Test')}
📞 <b>Телефон:</b> ${escapeHtml('998991234567')}

🛒 <b>Товары:</b>
  1. Test Product × 1 = ${formatP(100)}

💰 <b>Подитог:</b> ${formatP(100)}
🚚 <b>Доставка:</b> Самовывоз
<b>═══════════════</b>
💵 <b>ИТОГО: ${formatP(100)}</b>

📍 <b>Адрес:</b> Самовывоз
🗺️ <b>Зона:</b> Центр Ташкента
💳 <b>Оплата:</b> 💵 Наличные`;

  try {
    const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testIt();
