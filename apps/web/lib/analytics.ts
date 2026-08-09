/**
 * Google Analytics 4 (GA4) utilities for SmartWash.
 *
 * Measurement ID is read from NEXT_PUBLIC_GA_ID environment variable.
 * Set it in .env.local (or .env.production):
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *
 * GA4 Enhanced Measurement events (page_view, scroll, outbound_click,
 * file_download, video_start/progress/complete, form_submit) fire
 * automatically once the gtag.js snippet loads.
 *
 * Custom e-commerce events (view_item, add_to_cart, begin_checkout,
 * purchase) are fired explicitly via the helper functions below.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Returns true when GA4 is configured and running in the browser. */
export function isGAEnabled(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && !!GA_ID;
}

/**
 * Fire a GA4 event. Safe to call from SSR — no-ops when gtag is absent.
 *
 * @param action  Event name (e.g. "add_to_cart", "purchase")
 * @param params  Event parameters (GA4 e-commerce schema)
 */
export function trackEvent(action: string, params?: Record<string, unknown>): void {
  if (!isGAEnabled()) return;
  window.gtag('event', action, params);
}

// ─── E-commerce helpers ──────────────────────────────────────────────────────

interface ProductItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_category?: string;
  item_brand?: string;
}

/**
 * view_item — fires when the user opens a product page.
 */
export function trackViewItem(product: ProductItem): void {
  trackEvent('view_item', {
    currency: 'UZS',
    value: product.price,
    items: [product],
  });
}

/**
 * add_to_cart — fires when the user adds a product to the cart.
 */
export function trackAddToCart(product: ProductItem): void {
  trackEvent('add_to_cart', {
    currency: 'UZS',
    value: product.price * (product.quantity ?? 1),
    items: [product],
  });
}

/**
 * begin_checkout — fires when the user lands on the checkout page.
 */
export function trackBeginCheckout(
  items: ProductItem[],
  totalValue: number,
): void {
  trackEvent('begin_checkout', {
    currency: 'UZS',
    value: totalValue,
    items,
  });
}

/**
 * purchase — fires after a successful order placement.
 */
export function trackPurchase(
  orderId: string,
  items: ProductItem[],
  totalValue: number,
): void {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'UZS',
    value: totalValue,
    items,
  });
}
