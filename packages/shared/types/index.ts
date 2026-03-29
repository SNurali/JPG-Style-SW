// ─── Product ────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  sku: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  isBestseller: boolean;
  isNew: boolean;
  isActive: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  image: string; // primary image (first of images[])
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  sku: string;
  categoryId: string;
  isBestseller?: boolean;
  isNew?: boolean;
  stock: number;
  images?: string[];
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  bestsellers?: boolean;
  isNew?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// ─── Category ───────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateInput {
  name: string;
  slug: string;
  description: string;
  image?: string;
  sortOrder?: number;
}

// ─── Customer ───────────────────────────────────────────

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  telegramId?: string | null;
  addresses: CustomerAddress[];
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  label?: string;
  address: string;
  zone: string;
}

// ─── Order ──────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'awaiting' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryZone: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes: string;
  discountCode?: string | null;
  telegramMsgId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateInput {
  customerName: string;
  customerPhone: string;
  items: { productId: string; quantity: number }[];
  deliveryAddress: string;
  deliveryZone: string;
  deliveryFee: number;
  paymentMethod: string;
  notes?: string;
  discountCode?: string;
}

// ─── Review ─────────────────────────────────────────────

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerId?: string | null;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

// ─── Discount ───────────────────────────────────────────

export type DiscountType = 'percentage' | 'fixed';

export interface Discount {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
}

// ─── Inventory Log ──────────────────────────────────────

export interface InventoryLog {
  id: string;
  productId: string;
  quantityChange: number;
  reason: string;
  referenceId?: string;
  createdAt: string;
}

// ─── Admin User ─────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
  lastLogin?: string | null;
  createdAt: string;
}

// ─── API Responses ──────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Dashboard ──────────────────────────────────────────

export interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  pendingReviews: number;
  recentOrders: Order[];
  topProducts: { product: Product; soldCount: number }[];
}

// ─── Delivery Zones ─────────────────────────────────────

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
  estimatedTime: string;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: '1', name: 'Центр Ташкента', price: 15000, estimatedTime: '1–2 часа' },
  { id: '2', name: 'Ближние районы', price: 25000, estimatedTime: '2–4 часа' },
  { id: '3', name: 'Дальние районы', price: 35000, estimatedTime: 'В тот же день' },
  { id: '4', name: 'Самовывоз', price: 0, estimatedTime: '' },
];
