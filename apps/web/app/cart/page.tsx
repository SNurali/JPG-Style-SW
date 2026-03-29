'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/i18n';
import { formatPrice } from '@/lib/data';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="section-title mb-4">{t('cart.empty')}</h1>
        <p className="text-text-muted mb-8">{t('cart.emptyHint')}</p>
        <Link href="/categories" className="btn-primary">{t('hero.goToCatalog')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-accent transition-colors">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{t('cart.title')}</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">{t('cart.title')} ({totalItems})</h1>
        <button onClick={clearCart} className="text-sm text-danger hover:underline">
          {t('cart.clear')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="glass-card p-4 flex gap-4">
              {/* Product image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-primary-light">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-white text-sm mb-1 truncate">{item.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white font-semibold">{formatPrice(item.price, t('currency'))}</span>
                  {item.compareAtPrice && (
                    <span className="text-xs text-text-muted line-through">{formatPrice(item.compareAtPrice, t('currency'))}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity controls */}
                  <div className="flex items-center rounded-lg bg-primary-dark border border-white/5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-text-muted hover:text-white transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-text-muted hover:text-white transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-text-muted hover:text-danger transition-colors"
                  >
                    {t('cart.remove')}
                  </button>
                </div>
              </div>

              {/* Item total */}
              <div className="text-right hidden sm:block">
                <span className="font-heading font-bold text-white">{formatPrice(item.price * item.quantity, t('currency'))}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cart summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="font-heading font-semibold text-white mb-6">{t('cart.total')}</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t('cart.items')} ({totalItems})</span>
                <span className="text-white">{formatPrice(totalPrice, t('currency'))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t('delivery.title')}</span>
                <span className="text-text-muted">{t('cart.deliveryNote')}</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between">
                <span className="font-semibold text-white">{t('cart.total')}</span>
                <span className="font-heading font-bold text-white text-xl">{formatPrice(totalPrice, t('currency'))}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center block">
              {t('cart.checkout')}
            </Link>

            <Link href="/categories" className="block text-center text-sm text-accent hover:underline mt-4">
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
