/**
 * Format price in Uzbekistan soum.
 * Prices are stored as integers (e.g. 85000 = 85,000 сўм).
 */
export function formatPrice(price: number): string {
  const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formatted + ' сўм';
}

/**
 * Generate a URL-safe slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Generate a random order number: SW-XXXXX
 */
export function generateOrderNumber(): string {
  return 'SW-' + String(Math.floor(Math.random() * 90000) + 10000);
}

/**
 * Truncate text to a specified length.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a date string with time.
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get human-readable order status label.
 */
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    confirmed: 'Подтверждён',
    processing: 'В обработке',
    delivering: 'Доставляется',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
  };
  return labels[status] || status;
}

/**
 * Get human-readable payment status label.
 */
export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    awaiting: 'Ожидает оплаты',
    paid: 'Оплачено',
    failed: 'Ошибка',
    refunded: 'Возвращено',
  };
  return labels[status] || status;
}
