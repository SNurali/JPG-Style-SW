// In-memory fallback data — реальные товары JPG-Style SmartWash

const categories = [
  { id: '1', name: 'Автошампуни', slug: 'auto-shampoo', description: 'Профессиональные бесконтактные шампуни для автомоек', image: '/images/products/pink-shampoo-20kg.png', isActive: true, sortOrder: 1, productCount: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Активная пена', slug: 'active-foam', description: 'Премиальная активная пена для глубокой очистки', image: '/images/products/pink-panther-20kg.png', isActive: true, sortOrder: 2, productCount: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Химия для грузовиков', slug: 'truck-chemistry', description: 'Мощная химия для грузовиков и спецтехники', image: '/images/products/truck-chemistry-20kg.png', isActive: true, sortOrder: 3, productCount: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: 'Нано-шампуни', slug: 'nano-shampoo', description: 'Нано-шампуни с керамическим эффектом', image: '/images/products/nano-shampoo-5l.png', isActive: true, sortOrder: 4, productCount: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', name: 'Воск', slug: 'wax', description: 'Защитный воск для блеска и гидрофобного эффекта', image: '/images/products/wax-bubblegum-5l.png', isActive: true, sortOrder: 5, productCount: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', name: 'Чернитель резины', slug: 'tire-shine', description: 'Чернители шин: глянцевый и матовый эффект', image: '/images/products/tire-shine-glossy.png', isActive: true, sortOrder: 6, productCount: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', name: 'Сухой туман', slug: 'dry-fog', description: 'Ароматизация салона и устранение запахов', image: '/images/products/dry-fog-450ml.png', isActive: true, sortOrder: 7, productCount: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const products = [
  {
    id: '1', name: 'Автошампунь Розовый 20 кг', slug: 'pink-shampoo-20kg',
    description: 'Бесконтактный розовый автошампунь. Эффективно очищает и защищает все типы покрытий. Обильная пена, нейтральный pH. Для профессиональных автомоек.',
    price: 550000, compareAtPrice: null, sku: 'SW-PS-20',
    categoryId: '1', categoryName: 'Автошампуни', categorySlug: 'auto-shampoo',
    isBestseller: true, isNew: false, isActive: true, stock: 30,
    rating: 4.9, reviewCount: 47,
    images: ['/images/products/pink-shampoo-20kg.png'], image: '/images/products/pink-shampoo-20kg.png',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: '2', name: 'Pink Panther / Magic Active Foam 20 кг', slug: 'pink-panther-20kg',
    description: 'Премиальная розовая активная пена для превосходной очистки. Высокая пенообразующая способность. Безопасна для лакокрасочных покрытий.',
    price: 600000, compareAtPrice: null, sku: 'SW-PP-20',
    categoryId: '2', categoryName: 'Активная пена', categorySlug: 'active-foam',
    isBestseller: true, isNew: true, isActive: true, stock: 15,
    rating: 4.8, reviewCount: 32,
    images: ['/images/products/pink-panther-20kg.png'], image: '/images/products/pink-panther-20kg.png',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: '3', name: 'Активная химия для грузовиков 20 кг', slug: 'truck-chemistry-20kg',
    description: 'Мощная активная химия для тяжёлых грузовиков и спецтехники. Удаляет масло, битум, сажу. Профессиональная формула.',
    price: 450000, compareAtPrice: null, sku: 'SW-TC-20',
    categoryId: '3', categoryName: 'Химия для грузовиков', categorySlug: 'truck-chemistry',
    isBestseller: false, isNew: false, isActive: true, stock: 25,
    rating: 4.7, reviewCount: 18,
    images: ['/images/products/truck-chemistry-20kg.png'], image: '/images/products/truck-chemistry-20kg.png',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: '4', name: 'Нано-шампунь Bubble Gum 5 л', slug: 'nano-shampoo-bubblegum-5l',
    description: 'Нано-шампунь с ароматом Bubble Gum. Глубокая очистка и блестящий блеск. Керамический эффект защиты.',
    price: 300000, compareAtPrice: null, sku: 'SW-NS-5',
    categoryId: '4', categoryName: 'Нано-шампуни', categorySlug: 'nano-shampoo',
    isBestseller: true, isNew: true, isActive: true, stock: 40,
    rating: 4.9, reviewCount: 28,
    images: ['/images/products/nano-shampoo-5l.png'], image: '/images/products/nano-shampoo-5l.png',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: '5', name: 'Воск Bubble Gum 5 л', slug: 'wax-bubblegum-5l',
    description: 'Защитный воск с ароматом Bubble Gum. Придаёт глубокий блеск и гидрофобный эффект. Долговременная защита.',
    price: 200000, compareAtPrice: null, sku: 'SW-WX-5',
    categoryId: '5', categoryName: 'Воск', categorySlug: 'wax',
    isBestseller: true, isNew: false, isActive: true, stock: 35,
    rating: 4.8, reviewCount: 41,
    images: ['/images/products/wax-bubblegum-5l.png'], image: '/images/products/wax-bubblegum-5l.png',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: '6', name: 'Чернитель резины Глянцевый 10 л', slug: 'tire-shine-glossy-10l',
    description: 'Чернитель шин с глянцевым (мокрым) эффектом. Придаёт шинам насыщенный чёрный блеск. Долговременный эффект.',
    price: 170000, compareAtPrice: null, sku: 'SW-TG-10',
    categoryId: '6', categoryName: 'Чернитель резины', categorySlug: 'tire-shine',
    isBestseller: false, isNew: false, isActive: true, stock: 50,
    rating: 4.6, reviewCount: 22,
    images: ['/images/products/tire-shine-glossy.png'], image: '/images/products/tire-shine-glossy.png',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: '7', name: 'Чернитель резины Матовый 10 л', slug: 'tire-shine-matte-10l',
    description: 'Чернитель шин с натуральным матовым финишем. Естественный вид без лишнего блеска. UV-защита.',
    price: 130000, compareAtPrice: null, sku: 'SW-TM-10',
    categoryId: '6', categoryName: 'Чернитель резины', categorySlug: 'tire-shine',
    isBestseller: false, isNew: false, isActive: true, stock: 45,
    rating: 4.5, reviewCount: 15,
    images: ['/images/products/tire-shine-matte.png'], image: '/images/products/tire-shine-matte.png',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: '8', name: 'Сухой Туман 450 мл', slug: 'dry-fog-450ml',
    description: 'Ароматизация салона и устранение запахов. Лавандовый аромат. Устраняет запахи за 15 минут.',
    price: 90000, compareAtPrice: null, sku: 'SW-DF-450',
    categoryId: '7', categoryName: 'Сухой туман', categorySlug: 'dry-fog',
    isBestseller: false, isNew: true, isActive: true, stock: 60,
    rating: 4.7, reviewCount: 19,
    images: ['/images/products/dry-fog-450ml.png'], image: '/images/products/dry-fog-450ml.png',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
];

const reviews = [
  { id: '1', productId: '1', customerName: 'Сардор Т.', rating: 5, comment: 'Розовый шампунь просто огонь! Пена густая, машина блестит как новая. Для автомойки — лучший выбор!', isApproved: true, createdAt: new Date().toISOString() },
  { id: '2', productId: '2', customerName: 'Дильшод К.', rating: 5, comment: 'Pink Panther — мощная пена! Смывает всё без усилий. Рекомендую всем автомойкам.', isApproved: true, createdAt: new Date().toISOString() },
  { id: '3', productId: '4', customerName: 'Алишер М.', rating: 5, comment: 'Нано-шампунь Bubble Gum — аромат потрясающий, машина сверкает! Клиенты в восторге.', isApproved: true, createdAt: new Date().toISOString() },
  { id: '4', productId: '5', customerName: 'Бехзод Р.', rating: 5, comment: 'Воск даёт нереальный блеск. Гидрофобный эффект держится неделю минимум!', isApproved: true, createdAt: new Date().toISOString() },
  { id: '5', productId: '6', customerName: 'Жасур Н.', rating: 5, comment: 'Глянцевый чернитель — шины как новые! Эффект мокрых шин 💧', isApproved: true, createdAt: new Date().toISOString() },
];

const orders: any[] = [];
let orderCounter = 10000;

export const fallbackData = {
  getProducts(filters?: any) {
    let result = [...products];
    if (filters?.category) result = result.filter(p => p.categorySlug === filters.category);
    if (filters?.bestsellers) result = result.filter(p => p.isBestseller);
    if (filters?.isNew) result = result.filter(p => p.isNew);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return { data: result, pagination: { page: 1, limit: 20, total: result.length, totalPages: 1 } };
  },

  getProductBySlug(slug: string) { return products.find(p => p.slug === slug) || null; },
  getProductById(id: string) { return products.find(p => p.id === id) || null; },
  getBestsellers() { return products.filter(p => p.isBestseller); },
  getNewProducts() { return products.filter(p => p.isNew); },

  getCategories() { return categories; },
  getCategoryBySlug(slug: string) { return categories.find(c => c.slug === slug) || null; },

  getReviewsByProduct(productId: string) { return reviews.filter(r => r.productId === productId && r.isApproved); },

  createOrder(data: any) {
    orderCounter++;
    const order = {
      id: String(orders.length + 1),
      orderNumber: `SW-${orderCounter}`,
      ...data,
      status: 'pending',
      paymentStatus: data.paymentMethod === 'cash' ? 'pending' : 'awaiting',
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    return order;
  },

  getOrderByNumber(num: string) { return orders.find(o => o.orderNumber === num) || null; },
};
