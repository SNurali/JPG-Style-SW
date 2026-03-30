// Реальные данные JPG-Style SmartWash — из Telegram канала

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  isBestseller: boolean;
  isNew: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  productName: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const categories: Category[] = [
  {
    id: '1', name: 'Автошампуни', slug: 'auto-shampoo',
    description: 'Профессиональные бесконтактные шампуни для автомоек',
    image: `${API_URL}/images/products/pink-shampoo-20kg.png`, productCount: 1,
  },
  {
    id: '2', name: 'Активная пена', slug: 'active-foam',
    description: 'Премиальная активная пена для глубокой очистки',
    image: `${API_URL}/images/products/pink-panther-20kg.png`, productCount: 1,
  },
  {
    id: '3', name: 'Химия для грузовиков', slug: 'truck-chemistry',
    description: 'Мощная химия для грузовиков и спецтехники',
    image: `${API_URL}/images/products/truck-chemistry-20kg.png`, productCount: 1,
  },
  {
    id: '4', name: 'Нано-шампуни', slug: 'nano-shampoo',
    description: 'Нано-шампуни с керамическим эффектом',
    image: `${API_URL}/images/products/nano-shampoo-5l.png`, productCount: 1,
  },
  {
    id: '5', name: 'Воск', slug: 'wax',
    description: 'Защитный воск для блеска и гидрофобного эффекта',
    image: `${API_URL}/images/products/wax-bubblegum-5l.png`, productCount: 1,
  },
  {
    id: '6', name: 'Чернитель резины', slug: 'tire-shine',
    description: 'Чернители шин: глянцевый и матовый эффект',
    image: `${API_URL}/images/products/tire-shine-glossy.png`, productCount: 2,
  },
  {
    id: '7', name: 'Сухой туман', slug: 'dry-fog',
    description: 'Ароматизация салона и устранение запахов',
    image: `${API_URL}/images/products/dry-fog-450ml.png`, productCount: 1,
  },
];

export const products: Product[] = [
  {
    id: '1', name: 'Автошампунь Розовый 20 кг', slug: 'pink-shampoo-20kg',
    description: 'Бесконтактный розовый автошампунь. Эффективно очищает и защищает все типы покрытий. Обильная пена, нейтральный pH. Для профессиональных автомоек.',
    price: 550000,
    image: `${API_URL}/images/products/pink-shampoo-20kg.png`,
    images: [`${API_URL}/images/products/pink-shampoo-20kg.png`],
    category: 'Автошампуни', categorySlug: 'auto-shampoo',
    isBestseller: true, isNew: false, stock: 30, rating: 4.9, reviewCount: 47, sku: 'SW-PS-20',
  },
  {
    id: '2', name: 'Pink Panther / Magic Active Foam 20 кг', slug: 'pink-panther-20kg',
    description: 'Премиальная розовая активная пена. Высокая пенообразующая способность. Безопасна для ЛКП. Самая мощная пена в линейке SmartWash.',
    price: 600000,
    image: `${API_URL}/images/products/pink-panther-20kg.png`,
    images: [`${API_URL}/images/products/pink-panther-20kg.png`],
    category: 'Активная пена', categorySlug: 'active-foam',
    isBestseller: true, isNew: true, stock: 15, rating: 4.8, reviewCount: 32, sku: 'SW-PP-20',
  },
  {
    id: '3', name: 'Активная химия для грузовиков 20 кг', slug: 'truck-chemistry-20kg',
    description: 'Мощная активная химия для тяжёлых грузовиков и спецтехники. Удаляет масло, битум, сажу. Профессиональная формула.',
    price: 450000,
    image: `${API_URL}/images/products/truck-chemistry-20kg.png`,
    images: [`${API_URL}/images/products/truck-chemistry-20kg.png`],
    category: 'Химия для грузовиков', categorySlug: 'truck-chemistry',
    isBestseller: false, isNew: false, stock: 25, rating: 4.7, reviewCount: 18, sku: 'SW-TC-20',
  },
  {
    id: '4', name: 'Нано-шампунь Bubble Gum 5 л', slug: 'nano-shampoo-bubblegum-5l',
    description: 'Нано-шампунь с ароматом Bubble Gum. Глубокая очистка и блестящий блеск. Керамический эффект защиты.',
    price: 300000,
    image: `${API_URL}/images/products/nano-shampoo-5l.png`,
    images: [`${API_URL}/images/products/nano-shampoo-5l.png`],
    category: 'Нано-шампуни', categorySlug: 'nano-shampoo',
    isBestseller: true, isNew: true, stock: 40, rating: 4.9, reviewCount: 28, sku: 'SW-NS-5',
  },
  {
    id: '5', name: 'Воск Bubble Gum 5 л', slug: 'wax-bubblegum-5l',
    description: 'Защитный воск с ароматом Bubble Gum. Придает глубокий блеск и гидрофобный эффект. Долговременная защита.',
    price: 200000,
    image: `${API_URL}/images/products/wax-bubblegum-5l.png`,
    images: [`${API_URL}/images/products/wax-bubblegum-5l.png`],
    category: 'Воск', categorySlug: 'wax',
    isBestseller: true, isNew: false, stock: 35, rating: 4.8, reviewCount: 41, sku: 'SW-WX-5',
  },
  {
    id: '6', name: 'Чернитель резины Глянцевый 10 л', slug: 'tire-shine-glossy-10l',
    description: 'Чернитель шин с глянцевым (мокрым) эффектом. Придаёт шинам насыщенный чёрный блеск. Долговременный эффект.',
    price: 170000,
    image: `${API_URL}/images/products/tire-shine-glossy.png`,
    images: [`${API_URL}/images/products/tire-shine-glossy.png`],
    category: 'Чернитель резины', categorySlug: 'tire-shine',
    isBestseller: false, isNew: false, stock: 50, rating: 4.6, reviewCount: 22, sku: 'SW-TG-10',
  },
  {
    id: '7', name: 'Чернитель резины Матовый 10 л', slug: 'tire-shine-matte-10l',
    description: 'Чернитель шин с натуральным матовым финишем. Естественный вид без лишнего блеска. UV-защита.',
    price: 130000,
    image: `${API_URL}/images/products/tire-shine-matte.png`,
    images: [`${API_URL}/images/products/tire-shine-matte.png`],
    category: 'Чернитель резины', categorySlug: 'tire-shine',
    isBestseller: false, isNew: false, stock: 45, rating: 4.5, reviewCount: 15, sku: 'SW-TM-10',
  },
  {
    id: '8', name: 'Сухой Туман 450 мл', slug: 'dry-fog-450ml',
    description: 'Ароматизация салона и устранение запахов. Лавандовый аромат. Устраняет запахи за 15 минут.',
    price: 90000,
    image: `${API_URL}/images/products/dry-fog-450ml.png`,
    images: [`${API_URL}/images/products/dry-fog-450ml.png`],
    category: 'Сухой туман', categorySlug: 'dry-fog',
    isBestseller: false, isNew: true, stock: 60, rating: 4.7, reviewCount: 19, sku: 'SW-DF-450',
  },
];

export const reviews: Review[] = [
  { id: '1', customerName: 'Сардор Т.', rating: 5, comment: 'Розовый шампунь просто огонь! Пена густая, машина блестит как новая. Для автомойки — лучший!', date: '2026-03-15', productName: 'Автошампунь Розовый 20 кг' },
  { id: '2', customerName: 'Дильшод К.', rating: 5, comment: 'Pink Panther — мощная пена! Смывает всё без усилий. Рекомендую всем автомойкам.', date: '2026-03-10', productName: 'Pink Panther / Magic Active Foam 20 кг' },
  { id: '3', customerName: 'Алишер М.', rating: 5, comment: 'Нано-шампунь Bubble Gum — аромат потрясающий, машина сверкает! Клиенты в восторге.', date: '2026-03-08', productName: 'Нано-шампунь Bubble Gum 5 л' },
  { id: '4', customerName: 'Бехзод Р.', rating: 5, comment: 'Воск даёт нереальный блеск. Гидрофобный эффект держится неделю минимум!', date: '2026-02-28', productName: 'Воск Bubble Gum 5 л' },
  { id: '5', customerName: 'Жасур Н.', rating: 5, comment: 'Глянцевый чернитель — шины как новые! Эффект мокрых шин 💧 Супер!', date: '2026-02-20', productName: 'Чернитель резины Глянцевый 10 л' },
];

export function formatPrice(price: number, currencyLabel: string = 'сўм'): string {
  const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formatted + ' ' + currencyLabel;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
