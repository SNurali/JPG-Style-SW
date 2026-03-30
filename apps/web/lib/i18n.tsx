'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ru' | 'uz' | 'uz-cy' | 'en';

type Translations = Record<string, Record<Language, string>>;

export const translations: Translations = {
  // Navigation
  'nav.home': { ru: 'Главная', uz: 'Asosiy', 'uz-cy': 'Асосий', en: 'Home' },
  'nav.catalog': { ru: 'Каталог', uz: 'Katalog', 'uz-cy': 'Каталог', en: 'Catalog' },
  'nav.bestsellers': { ru: 'Хиты продаж', uz: 'Ommabop', 'uz-cy': 'Оммабоп', en: 'Bestsellers' },
  'nav.reviews': { ru: 'Отзывы', uz: 'Sharhlar', 'uz-cy': 'Шарҳлар', en: 'Reviews' },
  
  // Header options
  'header.search': { ru: 'Поиск по названию, артикулу...', uz: 'Nomi, artikuli bo`yicha qidiruv...', 'uz-cy': 'Номи, артикули бўйича қидирув...', en: 'Search by name, SKU...' },
  'header.cart': { ru: 'Корзина', uz: 'Savatcha', 'uz-cy': 'Саватча', en: 'Cart' },

  // Hero Section
  'hero.title': { ru: 'Премиальная автохимия для вашего авто', uz: 'Avtomobilingiz uchun premium avtokimyo', 'uz-cy': 'Автомобилингиз учун премиум автокимё', en: 'Premium Car Care Products for Your Vehicle' },
  'hero.subtitle': { ru: 'Профессиональные средства для детейлинга. Шампуни, нано-покрытия, воски, очистители — всё для идеального блеска.', uz: 'Diteyling uchun professional vositalar. Shampunlar, nano-qoplamalar, mumlar, tozalagichlar — ideal jilo uchun barchasi.', 'uz-cy': 'Дитейлинг учун профессионал воситалар. Шампунлар, нано-қопламалар, мумлар, тозалагичлар — идеал жило учун барчаси.', en: 'Professional detailing products. Shampoos, nano-coatings, waxes, cleaners — everything for a perfect shine.' },
  'hero.goToCatalog': { ru: 'Перейти в каталог', uz: 'Katalogga o\'tish', 'uz-cy': 'Каталогга ўтиш', en: 'Go to Catalog' },
  'hero.orderTelegram': { ru: 'Заказать в Telegram', uz: 'Telegram orqali buyurtma berish', 'uz-cy': 'Telegram орқали буюртма бериш', en: 'Order via Telegram' },
  'hero.askBot': { ru: '🤖 Заказать через SmartBot', uz: '🤖 SmartBot orqali buyurtma', 'uz-cy': '🤖 SmartBot орқали буюртма', en: '🤖 Order via SmartBot' },

  // Stats
  'stats.clients': { ru: 'Клиентов', uz: 'Mijozlar', 'uz-cy': 'Мижозлар', en: 'Clients' },
  'stats.products': { ru: 'Товаров', uz: 'Tovarlar', 'uz-cy': 'Товарлар', en: 'Products' },
  'stats.orders': { ru: 'Заказов', uz: 'Buyurtmalar', 'uz-cy': 'Буюртмалар', en: 'Orders' },
  'stats.rating': { ru: 'Рейтинг', uz: 'Reyting', 'uz-cy': 'Рейтинг', en: 'Rating' },

  // Catalog Section
  'catalog.title': { ru: 'Каталог продукции', uz: 'Mahsulotlar katalogi', 'uz-cy': 'Маҳсулотлар каталоги', en: 'Product Catalog' },
  'catalog.subtitle': { ru: 'Профессиональная автохимия от JPG-Style SmartWash', uz: 'JPG-Style SmartWashdan professional avtokimyo', 'uz-cy': 'JPG-Style SmartWashдан профессионал автокимё', en: 'Professional car care from JPG-Style SmartWash' },
  'catalog.itemsCount': { ru: 'товаров', uz: 'mahsulot', 'uz-cy': 'маҳсулот', en: 'products' },

  // Categories
  'cat.auto-shampoo': { ru: 'Автошампуни', uz: 'Avtoshampunlar', 'uz-cy': 'Автошампунлар', en: 'Auto Shampoos' },
  'cat.active-foam': { ru: 'Активная пена', uz: 'Faol ko\'pik', 'uz-cy': 'Фаол кўпик', en: 'Active Foam' },
  'cat.truck-chemistry': { ru: 'Химия для грузовиков', uz: 'Yuk mashinalari uchun kimyo', 'uz-cy': 'Юк машиналари учун кимё', en: 'Truck Chemistry' },
  'cat.nano-shampoo': { ru: 'Нано-шампуни', uz: 'Nano-shampunlar', 'uz-cy': 'Нано-шампунлар', en: 'Nano Shampoos' },
  'cat.wax': { ru: 'Воск', uz: 'Mum (Vosk)', 'uz-cy': 'Мум (Воск)', en: 'Wax' },
  'cat.tire-shine': { ru: 'Чернитель резины', uz: 'Shina qoraytirgich', 'uz-cy': 'Шина қорайтиргич', en: 'Tire Shine' },
  'cat.dry-fog': { ru: 'Сухой туман', uz: 'Quruq tuman', 'uz-cy': 'Қуруқ туман', en: 'Dry Fog' },

  // Bestsellers Section
  'bestsellers.title': { ru: 'Хиты продаж', uz: 'Ommabop', 'uz-cy': 'Оммабоп', en: 'Bestsellers' },
  'bestsellers.subtitle': { ru: 'Самые популярные товары по версии наших клиентов', uz: 'Mijozlarimiz fikricha eng mashhur mahsulotlar', 'uz-cy': 'Мижозларимиз фикрича энг машҳур маҳсулотлар', en: 'Most popular products according to our clients' },
  'bestsellers.hitLabel': { ru: 'Хит', uz: 'Xit', 'uz-cy': 'Хит', en: 'Hit' },

  // Product Card / Options
  'product.stockLeft': { ru: 'Осталось', uz: 'Qoldi', 'uz-cy': 'Қолди', en: 'Left' },
  'product.pcs': { ru: 'шт', uz: 'dona', 'uz-cy': 'дона', en: 'pcs' },
  'product.inStock': { ru: 'В наличии', uz: 'Mavjud', 'uz-cy': 'Мавжуд', en: 'In Stock' },
  'product.outOfStock': { ru: 'Нет в наличии', uz: 'Yashiringan', 'uz-cy': 'Мавжуд эмас', en: 'Out of Stock' },
  'product.description': { ru: 'Описание', uz: 'Tavsif', 'uz-cy': 'Тавсиф', en: 'Description' },
  'product.notFound': { ru: 'Товар не найден', uz: 'Mahsulot topilmadi', 'uz-cy': 'Маҳсулот топилмади', en: 'Product not found' },

  // Support CTA
  'support.questions': { ru: 'Есть вопросы?', uz: 'Savollar bormi?', 'uz-cy': 'Саволлар борми?', en: 'Have questions?' },
  'support.writeUs': { ru: 'Напишите нам в Telegram для консультации', uz: 'Maslahat uchun bizga Telegram orqali yozing', 'uz-cy': 'Маслаҳат учун бизга Telegram орқали ёзинг', en: 'Write us on Telegram for consultation' },
  'support.btn': { ru: 'Написать →', uz: 'Yozish →', 'uz-cy': 'Ёзиш →', en: 'Write →' },

  // Buttons
  'btn.addToCart': { ru: 'В корзину', uz: 'Savatchaga', 'uz-cy': 'Саватчага', en: 'Add to Cart' },
  'btn.added': { ru: '✅ В корзине', uz: '✅ Savatchada', 'uz-cy': '✅ Саватчада', en: '✅ Added' },
  'btn.buyNow': { ru: '⚡ Купить сейчас', uz: '⚡ Hozir xarid qilish', 'uz-cy': '⚡ Ҳозир харид қилиш', en: '⚡ Buy Now' },

  // New Arrivals Section
  'new.title': { ru: 'Новинки', uz: 'Yangi mahsulotlar', 'uz-cy': 'Янги маҳсулотлар', en: 'New Arrivals' },
  'new.subtitle': { ru: 'Свежие поступления в нашем каталоге', uz: 'Katalogimizdagi yangi mahsulotlar', 'uz-cy': 'Каталогимиздаги янги маҳсулотлар', en: 'Fresh additions to our catalog' },
  'new.newLabel': { ru: 'Новинка', uz: 'Yangi', 'uz-cy': 'Янги', en: 'New' },

  // Features Section (Why Choose Us)
  'features.title': { ru: 'Почему выбирают нас', uz: 'Nima uchun bizni tanlashadi', 'uz-cy': 'Нима учун бизни танлашади', en: 'Why Choose Us' },
  'features.subtitle': { ru: 'JPG Style SmartWash — ваш надёжный поставщик автохимии', uz: 'JPG Style SmartWash — sizning ishonchli avtokimyo yetkazib beruvchingiz', 'uz-cy': 'JPG Style SmartWash — сизнинг ишончли автокимё етказиб берувчингиз', en: 'JPG Style SmartWash — your reliable supplier of car care products' },
  
  'features.1.title': { ru: '500+ клиентов', uz: '500+ mijozlar', 'uz-cy': '500+ мижозлар', en: '500+ clients' },
  'features.1.desc': { ru: 'Довольных покупателей по всему Узбекистану', uz: 'Butun O\'zbekiston bo\'ylab mamnun xaridorlar', 'uz-cy': 'Бутун Ўзбекистон бўйлаб мамнун харидорлар', en: 'Satisfied customers all over Uzbekistan' },
  
  'features.2.title': { ru: 'Премиум качество', uz: 'Premium sifat', 'uz-cy': 'Премиум сифат', en: 'Premium quality' },
  'features.2.desc': { ru: 'Только проверенные профессиональные средства', uz: 'Faqat sinovdan o\'tgan professional vositalar', 'uz-cy': 'Фақат синовдан ўтган профессионал воситалар', en: 'Only proven professional products' },
  
  'features.3.title': { ru: 'Быстрая доставка', uz: 'Tez yetkazib berish', 'uz-cy': 'Тез етказиб бериш', en: 'Fast delivery' },
  'features.3.desc': { ru: 'Доставка в день заказа по Ташкенту', uz: 'Toshkent bo\'ylab buyurtma kunida yetkazib berish', 'uz-cy': 'Тошкент бўйлаб буюртма кунида етказиб бериш', en: 'Same-day delivery in Tashkent' },
  
  'features.4.title': { ru: '1000+ подписчиков', uz: '1000+ obunachilar', 'uz-cy': '1000+ обуначилар', en: '1000+ subscribers' },
  'features.4.desc': { ru: 'В нашем Telegram-канале', uz: 'Bizning Telegram kanalimizda', 'uz-cy': 'Бизнинг Telegram каналимизда', en: 'In our Telegram channel' },

  'features.5.title': { ru: 'Гарантия качества', uz: 'Sifat kafolati', 'uz-cy': 'Сифат кафолати', en: 'Quality guarantee' },
  'features.5.desc': { ru: 'Возврат в течение 14 дней', uz: '14 kun ichida qaytarish', 'uz-cy': '14 кун ичида қайтариш', en: '14-day return policy' },

  'features.6.title': { ru: 'Удобная оплата', uz: 'Qulay to`lov', 'uz-cy': 'Қулай тўлов', en: 'Convenient payment' },
  'features.6.desc': { ru: 'Click, Payme, наличные', uz: 'Click, Payme, naqd pul', 'uz-cy': 'Click, Payme, нақд пул', en: 'Click, Payme, cash' },

  // Reviews Section
  'reviews.title': { ru: 'Отзывы клиентов', uz: 'Mijozlar sharhlari', 'uz-cy': 'Мижозлар шарҳлари', en: 'Client Reviews' },
  'reviews.subtitle': { ru: 'Что говорят наши покупатели о продукции SmartWash', uz: 'SmartWash mahsulotlari haqida mijozlarimiz fikrlari', 'uz-cy': 'SmartWash маҳсулотлари ҳақида мижозларимиз фикрлари', en: 'What our customers say about SmartWash products' },

  // Footer
  'footer.description': { ru: 'Профессиональная автохимия и аксессуары для детейлинга. Премиальное качество для вашего автомобиля.', uz: 'Diteyling uchun professional avtokimyo va aksessuarlar. Avtomobilingiz uchun premium sifat.', 'uz-cy': 'Дитейлинг учун профессионал автокимё ва аксессуарлар. Автомобилингиз учун премиум сифат.', en: 'Professional car care and detailing accessories. Premium quality for your vehicle.' },
  'footer.info': { ru: 'Информация', uz: 'Ma\'lumot', 'uz-cy': 'Маълумот', en: 'Information' },
  'footer.about': { ru: 'О нас', uz: 'Biz haqimizda', 'uz-cy': 'Биз ҳақимизда', en: 'About Us' },
  'footer.delivery': { ru: 'Доставка', uz: 'Yetkazib berish', 'uz-cy': 'Етказиб бериш', en: 'Delivery' },
  'footer.payment': { ru: 'Оплата', uz: 'To\'lov', 'uz-cy': 'Тўлов', en: 'Payment' },
  'footer.contacts': { ru: 'Контакты', uz: 'Kontaktlar', 'uz-cy': 'Контактлар', en: 'Contacts' },
  'footer.contactUs': { ru: 'Связаться', uz: 'Bog\'lanish', 'uz-cy': 'Боғланиш', en: 'Contact Us' },
  'footer.telegram': { ru: 'Telegram канал', uz: 'Telegram kanal', 'uz-cy': 'Telegram канал', en: 'Telegram Channel' },
  'footer.address': { ru: 'Ташкент, Узбекистан', uz: 'Toshkent, O\'zbekiston', 'uz-cy': 'Тошкент, Ўзбекистон', en: 'Tashkent, Uzbekistan' },
  'footer.rights': { ru: 'Все права защищены.', uz: 'Barcha huquqlar himoyalangan.', 'uz-cy': 'Барча ҳуқуқлар ҳимояланган.', en: 'All rights reserved.' },
  'footer.weAccept': { ru: 'Мы принимаем:', uz: 'Biz qabul qilamiz:', 'uz-cy': 'Биз қабул қиламиз:', en: 'We accept:' },

  // Currency
  'currency': { ru: 'сўм', uz: 'so\'m', 'uz-cy': 'сўм', en: 'UZS' },

  // Cart Page
  'cart.empty': { ru: 'Корзина пуста', uz: 'Savatcha bo\'sh', 'uz-cy': 'Саватча бўш', en: 'Cart is empty' },
  'cart.emptyHint': { ru: 'Добавьте товары из каталога', uz: 'Katalogdan mahsulot qo\'shing', 'uz-cy': 'Каталогдан маҳсулот қўшинг', en: 'Add products from catalog' },
  'cart.title': { ru: 'Корзина', uz: 'Savatcha', 'uz-cy': 'Саватча', en: 'Cart' },
  'cart.clear': { ru: 'Очистить', uz: 'Tozalash', 'uz-cy': 'Тозалаш', en: 'Clear' },
  'cart.remove': { ru: 'Удалить', uz: 'O\'chirish', 'uz-cy': 'Ўчириш', en: 'Remove' },
  'cart.total': { ru: 'Итого', uz: 'Jami', 'uz-cy': 'Жами', en: 'Total' },
  'cart.items': { ru: 'Товары', uz: 'Tovarlar', 'uz-cy': 'Товарлар', en: 'Products' },
  'cart.deliveryNote': { ru: 'Рассчитывается при оформлении', uz: 'Rasmiylashtirish vaqtida hisoblanadi', 'uz-cy': 'Расмийлаштириш вақтида ҳисобланади', en: 'Calculated at checkout' },
  'cart.checkout': { ru: 'Оформить заказ', uz: 'Buyurtma berish', 'uz-cy': 'Буюртма бериш', en: 'Checkout' },
  'cart.continueShopping': { ru: 'Продолжить покупки', uz: 'Xaridni davom ettirish', 'uz-cy': 'Харидни давом эттириш', en: 'Continue shopping' },

  // Checkout Page
  'checkout.title': { ru: 'Оформление заказа', uz: 'Buyurtma rasmiylashtirish', 'uz-cy': 'Буюртма расмийлаштириш', en: 'Checkout' },
  'checkout.emptyHint': { ru: 'Добавьте товары для оформления заказа', uz: 'Buyurtma berish uchun mahsulot qo\'shing', 'uz-cy': 'Буюртма бериш учун маҳсулот қўшинг', en: 'Add products to place an order' },
  'checkout.contact': { ru: 'Контактные данные', uz: 'Aloqa ma\'lumotlari', 'uz-cy': 'Алоқа маълумотлари', en: 'Contact Information' },
  'checkout.firstName': { ru: 'Имя', uz: 'Ism', 'uz-cy': 'Исм', en: 'First Name' },
  'checkout.firstNamePh': { ru: 'Ваше имя', uz: 'Ismingiz', 'uz-cy': 'Исмингиз', en: 'Your first name' },
  'checkout.lastName': { ru: 'Фамилия', uz: 'Familiya', 'uz-cy': 'Фамилия', en: 'Last Name' },
  'checkout.lastNamePh': { ru: 'Ваша фамилия', uz: 'Familiyangiz', 'uz-cy': 'Фамилиянгиз', en: 'Your last name' },
  'checkout.phone': { ru: 'Телефон', uz: 'Telefon', 'uz-cy': 'Телефон', en: 'Phone' },

  // Delivery
  'delivery.title': { ru: 'Доставка', uz: 'Yetkazib berish', 'uz-cy': 'Етказиб бериш', en: 'Delivery' },
  'delivery.center': { ru: 'Центр Ташкента', uz: 'Toshkent markazi', 'uz-cy': 'Тошкент маркази', en: 'Tashkent Center' },
  'delivery.centerTime': { ru: '1–2 часа', uz: '1–2 soat', 'uz-cy': '1–2 соат', en: '1–2 hours' },
  'delivery.near': { ru: 'Ближние районы', uz: 'Yaqin tumanlar', 'uz-cy': 'Яқин туманлар', en: 'Nearby Areas' },
  'delivery.nearTime': { ru: '2–4 часа', uz: '2–4 soat', 'uz-cy': '2–4 соат', en: '2–4 hours' },
  'delivery.far': { ru: 'Дальние районы', uz: 'Uzoq tumanlar', 'uz-cy': 'Узоқ туманлар', en: 'Remote Areas' },
  'delivery.farTime': { ru: 'В тот же день', uz: 'Shu kunning o\'zida', 'uz-cy': 'Шу куннинг ўзида', en: 'Same day' },
  'delivery.bts': { ru: 'BTS (Другие регионы Узбекистана)', uz: 'BTS (O\'zbekistonning boshqa hududlari)', 'uz-cy': 'BTS (Ўзбекистоннинг бошқа ҳудудлари)', en: 'BTS (Other regions of Uzbekistan)' },
  'delivery.btsTime': { ru: 'По тарифу', uz: 'Tarif bo\'yicha', 'uz-cy': 'Тариф бўйича', en: 'By tariff' },
  'delivery.pickup': { ru: 'Самовывоз', uz: 'O\'zi olib ketish', 'uz-cy': 'Ўзи олиб кетиш', en: 'Self-pickup' },
  'delivery.free': { ru: 'Бесплатно', uz: 'Bepul', 'uz-cy': 'Бепул', en: 'Free' },
  'delivery.address': { ru: 'Адрес доставки', uz: 'Yetkazib berish manzili', 'uz-cy': 'Етказиб бериш манзили', en: 'Delivery Address' },
  'delivery.addressPh': { ru: 'Укажите полный адрес', uz: 'To\'liq manzilni kiriting', 'uz-cy': 'Тўлиқ манзилни киритинг', en: 'Enter full address' },
  'delivery.sendLocation': { ru: 'Отправить геолокацию', uz: 'Geolokatsiya yuborish', 'uz-cy': 'Геолокация юбориш', en: 'Send Geolocation' },
  'delivery.locationReceived': { ru: 'Локация получена ✅', uz: 'Lokatsiya qabul qilindi ✅', 'uz-cy': 'Локация қабул қилинди ✅', en: 'Location received ✅' },
  'delivery.locationHint': { ru: 'Для более точной доставки', uz: 'Aniqroq yetkazib berish uchun', 'uz-cy': 'Аниқроқ етказиб бериш учун', en: 'For more accurate delivery' },
  'delivery.locationLoading': { ru: 'Получаем...', uz: 'Yuklanmoqda...', 'uz-cy': 'Юкланмоқда...', en: 'Loading...' },
  'delivery.locationRefresh': { ru: 'Обновить', uz: 'Yangilash', 'uz-cy': 'Янгилаш', en: 'Refresh' },
  'delivery.locationShare': { ru: 'Поделиться', uz: 'Ulashish', 'uz-cy': 'Улашиш', en: 'Share' },

  // Payment
  'payment.title': { ru: 'Оплата', uz: 'To\'lov', 'uz-cy': 'Тўлов', en: 'Payment' },
  'payment.cash': { ru: 'Наличные при получении', uz: 'Qo\'lga olishda naqd pul', 'uz-cy': 'Қўлга олишда нақд пул', en: 'Cash on delivery' },

  // Promo Code
  'promo.title': { ru: 'Промокод', uz: 'Promokod', 'uz-cy': 'Промокод', en: 'Promo Code' },
  'promo.placeholder': { ru: 'Введите промокод', uz: 'Promokodni kiriting', 'uz-cy': 'Промокодни киритинг', en: 'Enter promo code' },
  'promo.apply': { ru: 'Применить', uz: 'Qo\'llash', 'uz-cy': 'Қўллаш', en: 'Apply' },
  'promo.applied': { ru: '✓ Применён', uz: '✓ Qo\'llanildi', 'uz-cy': '✓ Қўлланилди', en: '✓ Applied' },
  'promo.discount': { ru: 'Скидка', uz: 'Chegirma', 'uz-cy': 'Чегирма', en: 'Discount' },

  // Notes
  'notes.title': { ru: 'Комментарий', uz: 'Izoh', 'uz-cy': 'Изоҳ', en: 'Comment' },
  'notes.placeholder': { ru: 'Дополнительная информация к заказу...', uz: 'Buyurtma uchun qo\'shimcha ma\'lumot...', 'uz-cy': 'Буюртма учун қўшимча маълумот...', en: 'Additional information for the order...' },

  // Order Summary
  'order.yourOrder': { ru: 'Ваш заказ', uz: 'Sizning buyurtmangiz', 'uz-cy': 'Сизнинг буюртмангиз', en: 'Your Order' },
  'order.confirm': { ru: 'Подтвердить заказ', uz: 'Buyurtmani tasdiqlash', 'uz-cy': 'Буюртмани тасдиқлаш', en: 'Confirm Order' },
  'order.processing': { ru: '⏳ Оформляем...', uz: '⏳ Rasmiylashtirilmoqda...', 'uz-cy': '⏳ Расмийлаштирилмоқда...', en: '⏳ Processing...' },
  'order.terms': { ru: 'Нажимая "Подтвердить", вы соглашаетесь с условиями магазина', uz: '"Tasdiqlash" tugmasini bosib, siz do\'kon shartlarini qabul qilasiz', 'uz-cy': '"Тасдиқлаш" тугмасини босиб, сиз дўкон шартларини қабул қиласиз', en: 'By clicking "Confirm", you agree to the store terms' },

  // Order Confirmation
  'order.placed': { ru: 'Заказ оформлен!', uz: 'Buyurtma rasmiylashtirildi!', 'uz-cy': 'Буюртма расмийлаштирилди!', en: 'Order Placed!' },
  'order.number': { ru: 'Номер вашего заказа:', uz: 'Buyurtma raqamingiz:', 'uz-cy': 'Буюртма рақамингиз:', en: 'Your order number:' },
  'order.contactSoon': { ru: 'Мы свяжемся с вами в ближайшее время для подтверждения заказа. Уведомление также отправлено в Telegram.', uz: 'Buyurtmani tasdiqlash uchun tez orada siz bilan bog\'lanamiz. Telegram orqali ham bildirishnoma yuborildi.', 'uz-cy': 'Буюртмани тасдиқлаш учун тез орада сиз билан боғланамиз. Telegram орқали ҳам билдиришнома юборилди.', en: 'We will contact you shortly to confirm your order. A notification has also been sent via Telegram.' },
  'order.toHome': { ru: 'На главную', uz: 'Bosh sahifaga', 'uz-cy': 'Бош саҳифага', en: 'Go to Home' },
  'order.writeTelegram': { ru: 'Написать в Telegram', uz: 'Telegramga yozish', 'uz-cy': 'Телеграмга ёзиш', en: 'Write in Telegram' },

  // Category Page
  'category.notFound': { ru: 'Категория не найдена', uz: 'Kategoriya topilmadi', 'uz-cy': 'Категория топилмади', en: 'Category not found' },
  'category.all': { ru: 'Все категории', uz: 'Barcha kategoriyalar', 'uz-cy': 'Барча категориялар', en: 'All Categories' },
  'category.comingSoon': { ru: 'Товары в этой категории скоро появятся', uz: 'Bu kategoriya mahsulotlari tez orada paydo bo\'ladi', 'uz-cy': 'Бу категория маҳсулотлари тез орада пайдо бўлади', en: 'Products in this category coming soon' },

  // Category descriptions (by slug)
  'catDesc.auto-shampoo': { ru: 'Профессиональные бесконтактные шампуни для автомоек', uz: 'Avtomoykalar uchun professional kontaktsiz shampunlar', 'uz-cy': 'Автомойкалар учун профессионал контактсиз шампунлар', en: 'Professional contactless shampoos for car washes' },
  'catDesc.active-foam': { ru: 'Премиальная активная пена для глубокой очистки', uz: 'Chuqur tozalash uchun premium faol ko\'pik', 'uz-cy': 'Чуқур тозалаш учун премиум фаол кўпик', en: 'Premium active foam for deep cleaning' },
  'catDesc.truck-chemistry': { ru: 'Мощная химия для грузовиков и спецтехники', uz: 'Yuk mashinalari va maxsus texnika uchun kuchli kimyo', 'uz-cy': 'Юк машиналари ва махсус техника учун кучли кимё', en: 'Powerful chemistry for trucks and special equipment' },
  'catDesc.nano-shampoo': { ru: 'Нано-шампуни с керамическим эффектом', uz: 'Keramik effektli nano-shampunlar', 'uz-cy': 'Керамик эффектли нано-шампунлар', en: 'Nano shampoos with ceramic effect' },
  'catDesc.wax': { ru: 'Защитный воск для блеска и гидрофобного эффекта', uz: 'Jilo va gidrofob effekt uchun himoya mumi', 'uz-cy': 'Жило ва гидрофоб эффект учун ҳимоя муми', en: 'Protective wax for shine and hydrophobic effect' },
  'catDesc.tire-shine': { ru: 'Чернители шин: глянцевый и матовый эффект', uz: 'Shina qoraytirgichlar: yaltiroq va mat effekt', 'uz-cy': 'Шина қорайтиргичлар: ялтироқ ва мат эффект', en: 'Tire shine: glossy and matte effect' },
  'catDesc.dry-fog': { ru: 'Ароматизация салона и устранение запахов', uz: 'Salon xushbo\'ylantirilishi va hidlarni yo\'q qilish', 'uz-cy': 'Салон хушбўйлантирилиши ва ҳидларни йўқ қилиш', en: 'Cabin aromatization and odor removal' },

  // Geolocation alerts
  'geo.notSupported': { ru: 'Геолокация не поддерживается вашим браузером', uz: 'Geolokatsiya brauzeringiz tomonidan qo\'llab-quvvatlanmaydi', 'uz-cy': 'Геолокация браузерингиз томонидан қўллаб-қувватланмайди', en: 'Geolocation is not supported by your browser' },
  'geo.error': { ru: 'Ошибка при получении локации: разрешите доступ в настройках.', uz: 'Lokatsiyani olishda xatolik: sozlamalarda ruxsat bering.', 'uz-cy': 'Локацияни олишда хатолик: созламаларда рухсат беринг.', en: 'Error getting location: allow access in settings.' },
  'checkout.promoError': { ru: 'Ошибка проверки промокода', uz: 'Promokodni tekshirishda xatolik', 'uz-cy': 'Промокодни текширишда хатолик', en: 'Error verifying promo code' },
  'checkout.orderError': { ru: 'Ошибка оформления заказа. Попробуйте снова.', uz: 'Buyurtmani rasmiylashtrishda xatolik. Qaytadan urinib ko\'ring.', 'uz-cy': 'Буюртмани расмийлаштришда хатолик. Қайтадан уриниб кўринг.', en: 'Order error. Please try again.' },

  // Reviews count (for product page)
  'product.reviews': { ru: 'отзывов', uz: 'sharhlar', 'uz-cy': 'шарҳлар', en: 'reviews' },

  // How It Works
  'howItWorks.title': { ru: 'Как заказать', uz: 'Qanday buyurtma berish', 'uz-cy': 'Қандай буюртма бериш', en: 'How to Order' },
  'howItWorks.subtitle': { ru: 'Три простых шага до идеального результата', uz: 'Ideal natijagacha uchta oddiy qadam', 'uz-cy': 'Идеал натижагача учта оддий қадам', en: 'Three simple steps to a perfect result' },
  'howItWorks.1.title': { ru: 'Выберите товар', uz: 'Mahsulotni tanlang', 'uz-cy': 'Маҳсулотни танланг', en: 'Choose a Product' },
  'howItWorks.1.desc': { ru: 'Найдите нужное средство в каталоге или через SmartBot', uz: 'Katalogdan yoki SmartBot orqali kerakli vositani toping', 'uz-cy': 'Каталогдан ёки SmartBot орқали керакли воситани топинг', en: 'Find the product in the catalog or via SmartBot' },
  'howItWorks.2.title': { ru: 'Оформите заказ', uz: 'Buyurtma bering', 'uz-cy': 'Буюртма беринг', en: 'Place an Order' },
  'howItWorks.2.desc': { ru: 'Укажите адрес доставки и удобный способ оплаты', uz: 'Yetkazib berish manzili va qulay to\'lov usulini kiriting', 'uz-cy': 'Етказиб бериш манзили ва қулай тўлов усулини киритинг', en: 'Enter delivery address and convenient payment method' },
  'howItWorks.3.title': { ru: 'Получите доставку', uz: 'Yetkazib oling', 'uz-cy': 'Етказиб олинг', en: 'Receive Delivery' },
  'howItWorks.3.desc': { ru: 'Доставим в день заказа по всему Ташкенту', uz: 'Toshkent bo\'ylab buyurtma kunida yetkazamiz', 'uz-cy': 'Тошкент бўйлаб буюртма кунида етказамиз', en: 'Same-day delivery across Tashkent' },

  // Promo Banner
  'promo.title': { ru: 'Бесплатная доставка от 500 000 сўм', uz: '500 000 сўмдан бепул етказиб бериш', 'uz-cy': '500 000 сўмдан бепул етказиб бериш', en: 'Free delivery from 500,000 UZS' },
  'promo.desc': { ru: 'Закажите на сумму от 500 000 сўм и получите бесплатную доставку по Ташкенту', uz: '500 000 сўмдан кўпроқ buyurtma qiling va Toshkent bo\'ylab bepul yetkazib oling', 'uz-cy': '500 000 сўмдан кўпроқ буюртма қилинг ва Тошкент бўйлаб бепул етказиб олинг', en: 'Order over 500,000 UZS and get free delivery in Tashkent' },
  'promo.btn': { ru: 'Заказать сейчас', uz: 'Hozir buyurtma', 'uz-cy': 'Ҳозир буюртма', en: 'Order Now' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smartwash-lang') as Language;
    if (saved && ['ru', 'uz', 'uz-cy', 'en'].includes(saved)) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('smartwash-lang', lang);
  };

  const t = (key: string): string => {
    if (!mounted) {
      return translations[key]?.['ru'] || key;
    }
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
