'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/i18n';
import { formatPrice, type Product } from '@/lib/data';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="glass-card overflow-hidden hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1">
        {/* Image container */}
        <div className="relative aspect-square bg-primary-light overflow-hidden">
          {/* Product image */}
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Fallback gradient when no image */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-purple-500/10 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isBestseller && (
              <span className="badge-bestseller">🔥 {t('bestsellers.hitLabel')}</span>
            )}
            {product.isNew && (
              <span className="badge-new">✨ {t('new.newLabel')}</span>
            )}
            {product.compareAtPrice && (
              <span className="badge bg-danger text-white">
                -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Stock warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="badge-stock-low">{t('product.stockLeft')} {product.stock} {t('product.pcs')}</span>
            </div>
          )}

          {/* Quick add overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              className={`btn-primary text-sm py-2 px-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ${
                isAdded ? '!bg-green-500 !border-green-500 !text-white' : ''
              }`}
            >
              {isAdded ? t('btn.added') : t('btn.addToCart')}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-text-muted mb-1">{t(`cat.${product.categorySlug}`)}</p>
          <h3 className="font-heading font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-white/10'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-text-muted">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-white">{formatPrice(product.price, t('currency'))}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-text-muted line-through">{formatPrice(product.compareAtPrice, t('currency'))}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
