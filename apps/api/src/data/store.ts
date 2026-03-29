import { v4 as uuidv4 } from 'uuid';

// Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  isBestseller: boolean;
  isNew: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  sku: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryZone: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  notes: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

// In-memory store (will be replaced with PostgreSQL)
export const categories: Category[] = [
  { id: uuidv4(), name: 'Автошампуни', slug: 'auto-shampoo', description: 'Профессиональные шампуни для ручной и бесконтактной мойки', image: '', isActive: true, sortOrder: 1 },
  { id: uuidv4(), name: 'Нано покрытия', slug: 'nano-coating', description: 'Защитные нано-покрытия для кузова и стёкол', image: '', isActive: true, sortOrder: 2 },
  { id: uuidv4(), name: 'Воск', slug: 'wax', description: 'Автомобильный воск для блеска и защиты', image: '', isActive: true, sortOrder: 3 },
  { id: uuidv4(), name: 'Чернитель шин', slug: 'tire-blackener', description: 'Средства для ухода за шинами и резиной', image: '', isActive: true, sortOrder: 4 },
  { id: uuidv4(), name: 'Сухой туман', slug: 'dry-fog', description: 'Ароматизация и устранение запахов в салоне', image: '', isActive: true, sortOrder: 5 },
  { id: uuidv4(), name: 'Очистители салона', slug: 'interior-cleaners', description: 'Средства для чистки кожи, пластика и ткани', image: '', isActive: true, sortOrder: 6 },
  { id: uuidv4(), name: 'Аксессуары', slug: 'accessories', description: 'Микрофибры, аппликаторы, полировальные круги', image: '', isActive: true, sortOrder: 7 },
  { id: uuidv4(), name: 'Химия для детейлинга', slug: 'detailing-chemicals', description: 'Профессиональная химия для детейлинг-студий', image: '', isActive: true, sortOrder: 8 },
];

export const products: Product[] = [
  {
    id: uuidv4(), name: 'SmartWash Auto Shampoo 1L', slug: 'smartwash-auto-shampoo-1l',
    description: 'Концентрированный автошампунь для ручной мойки с нейтральным pH.',
    price: 85000, compareAtPrice: 120000, image: '', images: [],
    categoryId: categories[0].id, categoryName: 'Автошампуни', categorySlug: 'auto-shampoo',
    isBestseller: true, isNew: false, stock: 45, rating: 4.8, reviewCount: 23, sku: 'SW-SH-001',
    isActive: true, createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), name: 'NanoShield Pro Coating', slug: 'nanoshield-pro-coating',
    description: 'Керамическое нано-покрытие с эффектом гидрофоба. Защита до 12 месяцев.',
    price: 250000, image: '', images: [],
    categoryId: categories[1].id, categoryName: 'Нано покрытия', categorySlug: 'nano-coating',
    isBestseller: true, isNew: true, stock: 12, rating: 4.9, reviewCount: 15, sku: 'SW-NC-001',
    isActive: true, createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), name: 'Premium Carnauba Wax', slug: 'premium-carnauba-wax',
    description: 'Натуральный воск карнаубы высшего качества.',
    price: 180000, compareAtPrice: 220000, image: '', images: [],
    categoryId: categories[2].id, categoryName: 'Воск', categorySlug: 'wax',
    isBestseller: true, isNew: false, stock: 28, rating: 4.7, reviewCount: 31, sku: 'SW-WX-001',
    isActive: true, createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), name: 'BlackMax Tire Gel', slug: 'blackmax-tire-gel',
    description: 'Гель-чернитель для шин с долговременным эффектом.',
    price: 65000, image: '', images: [],
    categoryId: categories[3].id, categoryName: 'Чернитель шин', categorySlug: 'tire-blackener',
    isBestseller: false, isNew: false, stock: 56, rating: 4.5, reviewCount: 18, sku: 'SW-TB-001',
    isActive: true, createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), name: 'FreshFog Lavender', slug: 'freshfog-lavender',
    description: 'Сухой туман с ароматом лаванды.',
    price: 45000, image: '', images: [],
    categoryId: categories[4].id, categoryName: 'Сухой туман', categorySlug: 'dry-fog',
    isBestseller: false, isNew: true, stock: 3, rating: 4.6, reviewCount: 9, sku: 'SW-DF-001',
    isActive: true, createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), name: 'LeatherCare Pro Kit', slug: 'leathercare-pro-kit',
    description: 'Набор для ухода за кожаным салоном.',
    price: 320000, compareAtPrice: 400000, image: '', images: [],
    categoryId: categories[5].id, categoryName: 'Очистители салона', categorySlug: 'interior-cleaners',
    isBestseller: true, isNew: false, stock: 8, rating: 4.9, reviewCount: 42, sku: 'SW-IC-001',
    isActive: true, createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), name: 'Microfiber Towel Pack (5шт)', slug: 'microfiber-towel-pack-5',
    description: 'Набор из 5 микрофибровых полотенец 40x40 см.',
    price: 95000, image: '', images: [],
    categoryId: categories[6].id, categoryName: 'Аксессуары', categorySlug: 'accessories',
    isBestseller: false, isNew: false, stock: 120, rating: 4.4, reviewCount: 55, sku: 'SW-AC-001',
    isActive: true, createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(), name: 'Iron Remover 500ml', slug: 'iron-remover-500ml',
    description: 'Очиститель металлических вкраплений.',
    price: 135000, image: '', images: [],
    categoryId: categories[7].id, categoryName: 'Химия для детейлинга', categorySlug: 'detailing-chemicals',
    isBestseller: false, isNew: true, stock: 22, rating: 4.7, reviewCount: 11, sku: 'SW-DC-001',
    isActive: true, createdAt: new Date().toISOString(),
  },
];

export const orders: Order[] = [];

export const reviews: Review[] = [
  { id: uuidv4(), productId: products[0].id, customerName: 'Сардор Т.', rating: 5, comment: 'Шампунь просто огонь!', isApproved: true, createdAt: '2026-03-15T10:00:00Z' },
  { id: uuidv4(), productId: products[1].id, customerName: 'Дильшод К.', rating: 5, comment: 'Нано покрытие держится уже 6 месяцев.', isApproved: true, createdAt: '2026-03-10T10:00:00Z' },
  { id: uuidv4(), productId: products[2].id, customerName: 'Алишер М.', rating: 4, comment: 'Отличный блеск!', isApproved: true, createdAt: '2026-03-08T10:00:00Z' },
  { id: uuidv4(), productId: products[5].id, customerName: 'Бехзод Р.', rating: 5, comment: 'Качество на высоте!', isApproved: true, createdAt: '2026-02-28T10:00:00Z' },
  { id: uuidv4(), productId: products[3].id, customerName: 'Жасур Н.', rating: 5, comment: 'Чернитель шин — вещь!', isApproved: true, createdAt: '2026-02-20T10:00:00Z' },
];
