'use client';

import React, { useState, useRef, useEffect } from 'react';
import { products, formatPrice, type Product } from '@/lib/data';
import { createOrder } from '@/lib/api';
import { useLanguage } from '@/lib/i18n';

// ─── Chat Types ────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  products?: Product[];
  quickReplies?: string[];
  type?: 'text' | 'order-success';
  orderNumber?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

type ChatStep =
  | 'greeting'
  | 'browsing'
  | 'ask-name'
  | 'ask-phone'
  | 'ask-address'
  | 'ask-payment'
  | 'confirm'
  | 'done';

// ─── Chat Bot Translations ────────────────────────────────────
const chatTranslations: Record<string, Record<string, string>> = {
  'chat.greeting': {
    ru: '👋 Привет! Я — SmartBot, ваш помощник по заказам.\n\nЯ помогу вам быстро оформить заказ. Просто скажите, что вас интересует, или выберите из меню ниже!',
    uz: '👋 Salom! Men — SmartBot, buyurtma bo\'yicha yordamchingiz.\n\nMen sizga tez buyurtma berishga yordam beraman. Nima kerakligini ayting yoki quyidagi menyudan tanlang!',
    'uz-cy': '👋 Салом! Мен — SmartBot, буюртма бўйича ёрдамчингиз.\n\nМен сизга тез буюртма беришга ёрдам бераман. Нима кераклигини айтинг ёки қуйидаги менюдан танланг!',
    en: '👋 Hi! I\'m SmartBot, your order assistant.\n\nI\'ll help you place an order quickly. Just tell me what you need, or choose from the menu below!',
  },
  'chat.showAll': {
    ru: '🛍️ Показать все товары', uz: '🛍️ Barcha tovarlarni ko\'rsatish',
    'uz-cy': '🛍️ Барча товарларни кўрсатиш', en: '🛍️ Show all products',
  },
  'chat.bestsellers': {
    ru: '🔥 Хиты продаж', uz: '🔥 Ommabop', 'uz-cy': '🔥 Оммабоп', en: '🔥 Bestsellers',
  },
  'chat.help': {
    ru: '❓ Помощь', uz: '❓ Yordam', 'uz-cy': '❓ Ёрдам', en: '❓ Help',
  },
  'chat.checkout': {
    ru: '✅ Оформить заказ', uz: '✅ Buyurtma berish',
    'uz-cy': '✅ Буюртма бериш', en: '✅ Checkout',
  },
  'chat.cartEmpty': {
    ru: '🛒 Корзина пуста. Сначала добавьте товары!\n\nНапишите название товара или нажмите "Показать все товары".',
    uz: '🛒 Savatcha bo\'sh. Avval tovar qo\'shing!\n\nTovar nomini yozing yoki "Barcha tovarlarni ko\'rsatish" tugmasini bosing.',
    'uz-cy': '🛒 Саватча бўш. Аввал товар қўшинг!\n\nТовар номини ёзинг ёки "Барча товарларни кўрсатиш" тугмасини босинг.',
    en: '🛒 Cart is empty. Add products first!\n\nType a product name or click "Show all products".',
  },
  'chat.hereAreProducts': {
    ru: '📦 Вот наши товары. Нажмите + чтобы добавить:', uz: '📦 Mana bizning tovarlarimiz. Qo\'shish uchun + bosing:',
    'uz-cy': '📦 Мана бизнинг товарларимиз. Қўшиш учун + босинг:', en: '📦 Here are our products. Click + to add:',
  },
  'chat.hereBestsellers': {
    ru: '🔥 Наши хиты продаж:', uz: '🔥 Bizning eng ommabop tovarlarimiz:',
    'uz-cy': '🔥 Бизнинг энг оммабоп товарларимиз:', en: '🔥 Our bestsellers:',
  },
  'chat.added': {
    ru: '✅ Добавлено: ', uz: '✅ Qo\'shildi: ', 'uz-cy': '✅ Қўшилди: ', en: '✅ Added: ',
  },
  'chat.yourCart': {
    ru: '🛒 Ваша корзина:\n', uz: '🛒 Sizning savatchangiz:\n',
    'uz-cy': '🛒 Сизнинг саватчангиз:\n', en: '🛒 Your cart:\n',
  },
  'chat.total': { ru: '\n💰 Итого: ', uz: '\n💰 Jami: ', 'uz-cy': '\n💰 Жами: ', en: '\n💰 Total: ' },
  'chat.askName': {
    ru: '📋 Отлично! Как вас зовут? (Имя и Фамилия)', uz: '📋 Ajoyib! Ismingiz nima? (Ism va Familiya)',
    'uz-cy': '📋 Ажойиб! Исмингиз нима? (Исм ва Фамилия)', en: '📋 Great! What\'s your name? (First and Last)',
  },
  'chat.askPhone': {
    ru: '📞 Спасибо! Теперь укажите ваш номер телефона:', uz: '📞 Rahmat! Endi telefon raqamingizni kiriting:',
    'uz-cy': '📞 Раҳмат! Энди телефон рақамингизни киритинг:', en: '📞 Thanks! Now enter your phone number:',
  },
  'chat.askAddress': {
    ru: '📍 Куда доставить? Укажите адрес:', uz: '📍 Qayerga yetkazib berish kerak? Manzilni kiriting:',
    'uz-cy': '📍 Қаерга етказиб бериш керак? Манзилни киритинг:', en: '📍 Where to deliver? Enter your address:',
  },
  'chat.askPayment': {
    ru: '💳 Выберите способ оплаты:', uz: '💳 To\'lov usulini tanlang:',
    'uz-cy': '💳 Тўлов усулини танланг:', en: '💳 Choose payment method:',
  },
  'chat.confirm': {
    ru: '📋 Проверьте ваш заказ:\n', uz: '📋 Buyurtmangizni tekshiring:\n',
    'uz-cy': '📋 Буюртмангизни текширинг:\n', en: '📋 Review your order:\n',
  },
  'chat.name': { ru: '👤 Имя: ', uz: '👤 Ism: ', 'uz-cy': '👤 Исм: ', en: '👤 Name: ' },
  'chat.phone': { ru: '📞 Тел: ', uz: '📞 Tel: ', 'uz-cy': '📞 Тел: ', en: '📞 Phone: ' },
  'chat.address': { ru: '📍 Адрес: ', uz: '📍 Manzil: ', 'uz-cy': '📍 Манзил: ', en: '📍 Address: ' },
  'chat.payment': { ru: '💳 Оплата: ', uz: '💳 To\'lov: ', 'uz-cy': '💳 Тўлов: ', en: '💳 Payment: ' },
  'chat.confirmBtn': { ru: '✅ Подтвердить', uz: '✅ Tasdiqlash', 'uz-cy': '✅ Тасдиқлаш', en: '✅ Confirm' },
  'chat.editBtn': { ru: '✏️ Изменить', uz: '✏️ O\'zgartirish', 'uz-cy': '✏️ Ўзгартириш', en: '✏️ Edit' },
  'chat.orderSuccess': {
    ru: '🎉 Заказ оформлен!\n\nНомер заказа: ', uz: '🎉 Buyurtma tasdiqlandi!\n\nBuyurtma raqami: ',
    'uz-cy': '🎉 Буюртма тасдиқланди!\n\nБуюртма рақами: ', en: '🎉 Order placed!\n\nOrder number: ',
  },
  'chat.orderSuccessEnd': {
    ru: '\n\nМы свяжемся с вами в ближайшее время. Спасибо! 🙏',
    uz: '\n\nTez orada siz bilan bog\'lanamiz. Rahmat! 🙏',
    'uz-cy': '\n\nТез орада сиз билан боғланамиз. Раҳмат! 🙏',
    en: '\n\nWe\'ll contact you shortly. Thank you! 🙏',
  },
  'chat.orderError': {
    ru: '❌ Ошибка оформления. Попробуйте снова или напишите в Telegram.',
    uz: '❌ Xatolik yuz berdi. Qaytadan urinib ko\'ring yoki Telegramga yozing.',
    'uz-cy': '❌ Хатолик юз берди. Қайтадан уриниб кўринг ёки Телеграмга ёзинг.',
    en: '❌ Order error. Please try again or write us on Telegram.',
  },
  'chat.helpText': {
    ru: '💡 Я могу помочь:\n\n• Напишите название товара для поиска\n• Нажмите "Показать все товары"\n• Нажмите "Хиты продаж"\n• Добавьте товары и нажмите "Оформить заказ"\n\nЯ проведу вас через весь процесс! 🚀',
    uz: '💡 Men yordam bera olaman:\n\n• Tovar nomini yozing\n• "Barcha tovarlarni ko\'rsatish" bosing\n• "Ommabop" bosing\n• Tovar qo\'shing va "Buyurtma berish" bosing\n\nMen sizni butun jarayonda boshqaraman! 🚀',
    'uz-cy': '💡 Мен ёрдам бера оламан:\n\n• Товар номини ёзинг\n• "Барча товарларни кўрсатиш" босинг\n• "Оммабоп" босинг\n• Товар қўшинг ва "Буюртма бериш" босинг\n\nМен сизни бутун жараёнда бошқараман! 🚀',
    en: '💡 I can help you:\n\n• Type a product name to search\n• Click "Show all products"\n• Click "Bestsellers"\n• Add products and click "Checkout"\n\nI\'ll guide you through the process! 🚀',
  },
  'chat.cash': { ru: '💵 Наличные', uz: '💵 Naqd pul', 'uz-cy': '💵 Нақд пул', en: '💵 Cash' },
  'chat.click': { ru: '📱 Click', uz: '📱 Click', 'uz-cy': '📱 Click', en: '📱 Click' },
  'chat.payme': { ru: '📱 Payme', uz: '📱 Payme', 'uz-cy': '📱 Payme', en: '📱 Payme' },
  'chat.newOrder': { ru: '🛍️ Новый заказ', uz: '🛍️ Yangi buyurtma', 'uz-cy': '🛍️ Янги буюртма', en: '🛍️ New order' },
  'chat.inputPh': { ru: 'Напишите сообщение...', uz: 'Xabar yozing...', 'uz-cy': 'Хабар ёзинг...', en: 'Type a message...' },
  'chat.title': { ru: 'SmartBot 🤖', uz: 'SmartBot 🤖', 'uz-cy': 'SmartBot 🤖', en: 'SmartBot 🤖' },
  'chat.subtitle': { ru: 'Помощник по заказам', uz: 'Buyurtma yordamchisi', 'uz-cy': 'Буюртма ёрдамчиси', en: 'Order Assistant' },
  'chat.processing': { ru: '⏳ Оформляем ваш заказ...', uz: '⏳ Buyurtma rasmiylashtirmoqda...', 'uz-cy': '⏳ Буюртма расмийлаштирмоқда...', en: '⏳ Processing your order...' },
};

// ─── Component ─────────────────────────────────────────────────
export function ChatBot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<ChatStep>('greeting');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderData, setOrderData] = useState({ name: '', phone: '', address: '', payment: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ct = (key: string) => chatTranslations[key]?.[language] || chatTranslations[key]?.['ru'] || key;

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const addBotMessage = (text: string, extras: Partial<Message> = {}) => {
    const msg: Message = { id: uid(), role: 'bot', text, ...extras };
    setMessages(prev => [...prev, msg]);
    scrollToBottom();
    return msg;
  };

  const addUserMessage = (text: string) => {
    const msg: Message = { id: uid(), role: 'user', text };
    setMessages(prev => [...prev, msg]);
    scrollToBottom();
    return msg;
  };

  // Open chat & greet
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      setTimeout(() => {
        addBotMessage(ct('chat.greeting'), {
          quickReplies: [ct('chat.showAll'), ct('chat.bestsellers'), ct('chat.help')],
        });
        setStep('browsing');
      }, 300);
    }
  }, [isOpen, hasGreeted]);

  // Listen for hero button event
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-smartbot', handler);
    return () => window.removeEventListener('open-smartbot', handler);
  }, []);

  // ─── Add to cart ───────────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    addBotMessage(
      ct('chat.added') + product.name + ` (${formatPrice(product.price)})`,
      { quickReplies: [ct('chat.showAll'), ct('chat.checkout')] }
    );
  };

  // ─── Cart summary text ─────────────────────────────────────
  const getCartSummary = () => {
    let text = ct('chat.yourCart');
    let total = 0;
    cart.forEach((item, i) => {
      const itemTotal = item.product.price * item.quantity;
      total += itemTotal;
      text += `${i + 1}. ${item.product.name} × ${item.quantity} = ${formatPrice(itemTotal)}\n`;
    });
    text += ct('chat.total') + formatPrice(total);
    return { text, total };
  };

  // ─── Handle user message ──────────────────────────────────
  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    addUserMessage(msg);

    // Quick reply handlers
    if (msg === ct('chat.showAll')) {
      setTimeout(() => {
        addBotMessage(ct('chat.hereAreProducts'), { products: products });
      }, 400);
      return;
    }
    if (msg === ct('chat.bestsellers')) {
      const best = products.filter(p => p.isBestseller);
      setTimeout(() => {
        addBotMessage(ct('chat.hereBestsellers'), { products: best });
      }, 400);
      return;
    }
    if (msg === ct('chat.help')) {
      setTimeout(() => addBotMessage(ct('chat.helpText')), 400);
      return;
    }
    if (msg === ct('chat.checkout')) {
      if (cart.length === 0) {
        setTimeout(() => addBotMessage(ct('chat.cartEmpty')), 400);
        return;
      }
      const { text: summary } = getCartSummary();
      setTimeout(() => {
        addBotMessage(summary);
        setTimeout(() => {
          addBotMessage(ct('chat.askName'));
          setStep('ask-name');
        }, 600);
      }, 400);
      return;
    }
    if (msg === ct('chat.newOrder')) {
      setCart([]);
      setOrderData({ name: '', phone: '', address: '', payment: '' });
      setStep('browsing');
      setTimeout(() => {
        addBotMessage(ct('chat.greeting'), {
          quickReplies: [ct('chat.showAll'), ct('chat.bestsellers')],
        });
      }, 400);
      return;
    }

    // Step-based handling
    switch (step) {
      case 'browsing': {
        // Search products
        const query = msg.toLowerCase();
        const found = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.slug.includes(query)
        );
        if (found.length > 0) {
          setTimeout(() => addBotMessage(`🔍 ${found.length} ${language === 'en' ? 'found' : language === 'uz' ? 'topildi' : 'найдено'}:`, { products: found }), 400);
        } else {
          setTimeout(() => addBotMessage(ct('chat.helpText'), {
            quickReplies: [ct('chat.showAll'), ct('chat.bestsellers')],
          }), 400);
        }
        break;
      }
      case 'ask-name':
        setOrderData(prev => ({ ...prev, name: msg }));
        setStep('ask-phone');
        setTimeout(() => addBotMessage(ct('chat.askPhone')), 400);
        break;
      case 'ask-phone':
        setOrderData(prev => ({ ...prev, phone: msg }));
        setStep('ask-address');
        setTimeout(() => addBotMessage(ct('chat.askAddress')), 400);
        break;
      case 'ask-address':
        setOrderData(prev => ({ ...prev, address: msg }));
        setStep('ask-payment');
        setTimeout(() => addBotMessage(ct('chat.askPayment'), {
          quickReplies: [ct('chat.cash'), ct('chat.click'), ct('chat.payme')],
        }), 400);
        break;
      case 'ask-payment': {
        const payment = msg.replace(/[💵📱]/g, '').trim();
        setOrderData(prev => ({ ...prev, payment }));
        setStep('confirm');
        const { text: summary, total } = getCartSummary();
        const confirmText =
          ct('chat.confirm') +
          summary + '\n\n' +
          ct('chat.name') + orderData.name + '\n' +
          ct('chat.phone') + orderData.phone + '\n' +
          ct('chat.address') + orderData.address + '\n' +
          ct('chat.payment') + payment;
        setTimeout(() => addBotMessage(confirmText, {
          quickReplies: [ct('chat.confirmBtn'), ct('chat.editBtn')],
        }), 400);
        break;
      }
      case 'confirm': {
        if (msg === ct('chat.editBtn')) {
          setStep('ask-name');
          setTimeout(() => addBotMessage(ct('chat.askName')), 400);
          return;
        }
        if (msg === ct('chat.confirmBtn')) {
          setIsProcessing(true);
          addBotMessage(ct('chat.processing'));
          try {
            const payMethodMap: Record<string, string> = {
              [ct('chat.cash').replace(/[💵📱]/g, '').trim()]: 'cash',
              'Click': 'click', 'Payme': 'payme',
            };
            const result = await createOrder({
              customerName: orderData.name,
              customerPhone: orderData.phone,
              items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity })),
              deliveryAddress: orderData.address,
              deliveryZone: 'Ташкент',
              deliveryFee: 15000,
              paymentMethod: payMethodMap[orderData.payment] || 'cash',
              notes: 'Заказ через SmartBot AI',
            });
            setMessages(prev => prev.filter(m => m.text !== ct('chat.processing')));
            addBotMessage(
              ct('chat.orderSuccess') + result.data.orderNumber + ct('chat.orderSuccessEnd'),
              { type: 'order-success', orderNumber: result.data.orderNumber, quickReplies: [ct('chat.newOrder')] }
            );
            setStep('done');
            setCart([]);
          } catch (err) {
            setMessages(prev => prev.filter(m => m.text !== ct('chat.processing')));
            addBotMessage(ct('chat.orderError'), { quickReplies: [ct('chat.confirmBtn')] });
          } finally {
            setIsProcessing(false);
          }
        }
        break;
      }
      default:
        break;
    }
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
        }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-bounce">
                {cartCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden flex flex-col"
          style={{
            height: 'min(600px, calc(100vh - 8rem))',
            background: 'rgba(15, 15, 30, 0.98)',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.15)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              🤖
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm">{ct('chat.title')}</h3>
              <p className="text-xs text-white/50">{ct('chat.subtitle')}</p>
            </div>
            {cartCount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                🛒 {cartCount}
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-md'
                    : 'text-white/90 rounded-bl-md border border-white/5'
                }`} style={{
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(255,255,255,0.05)',
                }}>
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Product cards inside message */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.products.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                            <p className="text-xs text-purple-300 font-bold">{formatPrice(p.price)}</p>
                          </div>
                          <button
                            onClick={() => addToCart(p)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 hover:scale-110 transition-transform"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                          >
                            +
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order success animation */}
                  {msg.type === 'order-success' && (
                    <div className="mt-3 text-center">
                      <div className="text-4xl animate-bounce">🎉</div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick replies */}
            {messages.length > 0 && messages[messages.length - 1].quickReplies && (
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1].quickReplies!.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-white/90 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 transition-all"
                    style={{ background: 'rgba(99,102,241,0.1)' }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10" style={{ background: 'rgba(15,15,30,0.95)' }}>
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={ct('chat.inputPh')}
                disabled={isProcessing}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-30 hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
