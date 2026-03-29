const TELEGRAM_API = 'https://api.telegram.org/bot';

function getBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN || '';
}

function getChatId(): string {
  return process.env.TELEGRAM_CHAT_ID || '';
}

interface OrderNotification {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: { productName: string; quantity: number; unitPrice: number; totalPrice: number }[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryZone: string;
  paymentMethod: string;
  notes: string;
  location?: { lat: number; lng: number };
}

export const telegramService = {
  isPolling: false,
  lastUpdateId: 0,

  async startPolling() {
    if (this.isPolling) return;
    const token = getBotToken();
    if (!token) return;
    this.isPolling = true;

    const poll = async () => {
      try {
        const res = await fetch(`${TELEGRAM_API}${token}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=30`);
        if (res.ok) {
          const data = (await res.json()) as any;
          if (data.ok && data.result) {
            for (const update of data.result) {
              this.lastUpdateId = Math.max(this.lastUpdateId, update.update_id);
              if (update.callback_query) {
                const cb = update.callback_query;
                const action = cb.data || '';
                if (action.startsWith('confirm_') || action.startsWith('cancel_')) {
                  const parts = action.split('_');
                  const statusEvent = parts[0];
                  const orderNum = parts[1];
                  const newStatus = statusEvent === 'confirm' ? 'processing' : 'cancelled';
                  
                  // Answer callback
                  await fetch(`${TELEGRAM_API}${token}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: cb.id, text: `Заказ ${orderNum} ${statusEvent === 'confirm' ? 'взят в работу' : 'отменен'}` })
                  });

                  // Remove buttons
                  await fetch(`${TELEGRAM_API}${token}/editMessageReplyMarkup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: cb.message.chat.id, message_id: cb.message.message_id, reply_markup: { inline_keyboard: [] } })
                  });
                  
                  await this.sendStatusUpdate(cb.message.chat.id, orderNum, newStatus);

                  // Update DB
                  try {
                    const fallbackLib = await import('../data/fallback');
                    const fbOrder = fallbackLib.fallbackData.getOrderByNumber(orderNum);
                    if (fbOrder) fbOrder.status = newStatus;

                    const mainLib = await import('../main');
                    if (mainLib.isDbAvailable()) {
                       const { orderRepository } = await import('../repositories/order.repository');
                       const dbOrder = await orderRepository.findByOrderNumber(orderNum);
                       if (dbOrder) await orderRepository.updateStatus(dbOrder.id, newStatus);
                    }
                  } catch (e) {
                    console.error('DB Telegram update err', e);
                  }
                }
              }
            }
          }
        }
      } catch (err) {}
      if (this.isPolling) setTimeout(poll, 1000);
    };
    poll();
    console.log('🤖 Telegram Bot polling started');
  },

  async sendOrderNotification(order: OrderNotification): Promise<string | null> {
    const token = getBotToken();
    const chatId = getChatId();

    if (!token || !chatId) {
      console.log('⚠️ Telegram credentials not configured, skipping notification');
      return null;
    }

    const paymentLabels: Record<string, string> = {
      cash: '💵 Наличные',
      click: '📱 Click',
      payme: '📱 Payme',
    };

    const itemLines = order.items
      .map((item, i) => `  ${i + 1}. ${item.productName} × ${item.quantity} = ${formatP(item.totalPrice)}`)
      .join('\n');

    const message = `🆕 <b>Новый заказ!</b>

📋 <b>${order.orderNumber}</b>

👤 <b>Клиент:</b> ${escapeHtml(order.customerName)}
📞 <b>Телефон:</b> ${escapeHtml(order.customerPhone)}

🛒 <b>Товары:</b>
${itemLines}

💰 <b>Подитог:</b> ${formatP(order.subtotal)}${order.discountAmount > 0 ? `\n🏷️ <b>Скидка:</b> -${formatP(order.discountAmount)}` : ''}
🚚 <b>Доставка:</b> ${order.deliveryFee > 0 ? formatP(order.deliveryFee) : 'Самовывоз'}
<b>═══════════════</b>
💵 <b>ИТОГО: ${formatP(order.total)}</b>

📍 <b>Адрес:</b> ${escapeHtml(order.deliveryAddress || 'Самовывоз')}
🗺️ <b>Зона:</b> ${escapeHtml(order.deliveryZone)}
💳 <b>Оплата:</b> ${paymentLabels[order.paymentMethod] || order.paymentMethod}
${order.notes ? `📝 <b>Комментарий:</b> ${escapeHtml(order.notes)}` : ''}`;

    try {
      const response = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ Подтвердить', callback_data: `confirm_${order.orderNumber}` },
                { text: '❌ Отменить', callback_data: `cancel_${order.orderNumber}` },
              ],
            ],
          },
        }),
      });

      const data = (await response.json()) as any;
      if (data.ok) {
        console.log(`📱 Telegram notification sent for ${order.orderNumber}`);
        
        // If location is provided, send a map pin
        if (order.location) {
          try {
            await fetch(`${TELEGRAM_API}${token}/sendLocation`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                latitude: order.location.lat,
                longitude: order.location.lng,
                reply_to_message_id: data.result.message_id
              }),
            });
            console.log(`📍 Telegram location pin sent for ${order.orderNumber}`);
          } catch (locErr) {
            console.error('❌ Telegram sendLocation error:', locErr);
          }
        }

        return String(data.result.message_id);
      } else {
        console.error('❌ Telegram API error:', data.description);
        return null;
      }
    } catch (err) {
      console.error('❌ Telegram send error:', err);
      return null;
    }
  },

  async sendStatusUpdate(chatId: string, orderNumber: string, status: string): Promise<void> {
    const token = getBotToken();
    const targetChat = chatId || getChatId();

    if (!token || !targetChat) return;

    const statusLabels: Record<string, string> = {
      confirmed: '✅ Подтверждён',
      processing: '📦 В обработке',
      delivering: '🚚 Доставляется',
      delivered: '🎉 Доставлен',
      cancelled: '❌ Отменён',
    };

    const message = `📋 <b>Заказ ${orderNumber}</b>\n\n🔄 Статус: <b>${statusLabels[status] || status}</b>`;

    try {
      await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChat,
          text: message,
          parse_mode: 'HTML',
        }),
      });
    } catch (err) {
      console.error('❌ Telegram status update error:', err);
    }
  },

  async sendMessage(text: string): Promise<void> {
    const token = getBotToken();
    const chatId = getChatId();

    if (!token || !chatId) return;

    try {
      await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      });
    } catch (err) {
      console.error('❌ Telegram message error:', err);
    }
  },
};

function formatP(price: number): string {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' сўм';
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
