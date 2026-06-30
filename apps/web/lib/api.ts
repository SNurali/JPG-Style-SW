const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/api\/?$/, '');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/** Authorization header from the stored customer token (if any). */
export function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const t = localStorage.getItem('sw-customer-token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// ─── Products ───────────────────────────────────────────

export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  bestsellers?: boolean;
  isNew?: boolean;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.bestsellers) searchParams.set('bestsellers', 'true');
  if (params?.isNew) searchParams.set('new', 'true');
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const qs = searchParams.toString();
  return request<any>(`/api/products${qs ? `?${qs}` : ''}`);
}

export async function fetchProductBySlug(slug: string) {
  return request<any>(`/api/products/${slug}`);
}

export async function fetchBestsellers() {
  return request<any>('/api/products/bestsellers');
}

export async function fetchNewProducts() {
  return request<any>('/api/products/new');
}

// ─── Categories ─────────────────────────────────────────

export async function fetchCategories() {
  return request<any>('/api/categories');
}

export async function fetchCategoryBySlug(slug: string) {
  return request<any>(`/api/categories/${slug}`);
}

// ─── Orders ─────────────────────────────────────────────

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  items: { productId: string; quantity: number }[];
  deliveryAddress: string;
  deliveryZone: string;
  deliveryFee: number;
  paymentMethod: string;
  notes?: string;
  discountCode?: string;
  location?: { lat: number; lng: number };
}) {
  return request<any>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeaders(),
  });
}

// ─── Customer auth ──────────────────────────────────────

export async function registerCustomer(data: { name: string; email: string; phone?: string; password: string }) {
  return request<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export async function loginCustomer(data: { email: string; password: string }) {
  return request<any>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
}

export async function googleLoginCustomer(idToken: string) {
  return request<any>('/api/auth/google', { method: 'POST', body: JSON.stringify({ idToken }) });
}

export async function fetchMe() {
  return request<any>('/api/auth/me', { headers: authHeaders() });
}

export async function fetchMyOrders() {
  return request<any>('/api/auth/orders', { headers: authHeaders() });
}

export async function updateMyProfile(data: { name?: string; phone?: string }) {
  return request<any>('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(data), headers: authHeaders() });
}

export async function fetchOrderStatus(orderNumber: string) {
  return request<any>(`/api/orders/${orderNumber}/status`);
}

// ─── Reviews ────────────────────────────────────────────

export async function fetchReviews(productId: string) {
  return request<any>(`/api/reviews/${productId}`);
}

export async function submitReview(data: {
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
}) {
  return request<any>('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Discounts ──────────────────────────────────────────

export async function validateDiscount(code: string, orderTotal: number) {
  return request<any>('/api/orders/discounts/validate', {
    method: 'POST',
    body: JSON.stringify({ code, orderTotal }),
  });
}

// ─── Search ─────────────────────────────────────────────

export async function searchProducts(query: string) {
  return fetchProducts({ search: query, limit: 10 });
}
