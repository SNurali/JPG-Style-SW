'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/i18n';
import { products, formatPrice, type Product } from '@/lib/data';

function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { t } = useLanguage();

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="section-title mb-4">{t('product.notFound')}</h1>
        <Link href="/categories" className="btn-primary">{t('hero.goToCatalog')}</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
    }, quantity);
    window.location.href = '/checkout';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-accent transition-colors">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-accent transition-colors">{t('nav.catalog')}</Link>
        <span className="mx-2">/</span>
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-accent transition-colors">{t(`cat.${product.categorySlug}`)}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div className="space-y-4">
          <div className="glass-card aspect-square overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.isBestseller && <span className="badge-bestseller text-sm">🔥 {t('bestsellers.hitLabel')}</span>}
              {product.isNew && <span className="badge-new text-sm">✨ {t('new.newLabel')}</span>}
              {product.compareAtPrice && (
                <span className="badge bg-danger text-white text-sm">
                  -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product info */}
        <div>
          <div className="mb-2">
            <span className="text-sm text-text-muted">SKU: {product.sku}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-white/10'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-text-muted">{product.rating} ({product.reviewCount} {t('product.reviews')})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-heading text-3xl font-bold text-white">{formatPrice(product.price, t('currency'))}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-text-muted line-through">{formatPrice(product.compareAtPrice, t('currency'))}</span>
            )}
          </div>

          {/* Stock status */}
          <div className="mb-6">
            {product.stock > 5 ? (
              <span className="text-sm text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                {t('product.inStock')}
              </span>
            ) : product.stock > 0 ? (
              <span className="text-sm text-orange-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                {t('product.stockLeft')} {product.stock} {t('product.pcs')}!
              </span>
            ) : (
              <span className="text-sm text-danger flex items-center gap-1">
                <span className="w-2 h-2 bg-danger rounded-full" />
                {t('product.outOfStock')}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="glass-card p-6 mb-6">
            <h3 className="font-heading font-semibold text-white mb-2">{t('product.description')}</h3>
            <p className="text-text-muted text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center glass-card">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-text-muted hover:text-white transition-colors"
              >
                −
              </button>
              <span className="px-4 py-3 font-semibold text-white min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-3 text-text-muted hover:text-white transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`btn-primary flex-1 flex items-center justify-center gap-2 transition-all duration-300 ${addedToCart ? '!bg-green-500 !border-green-500 !shadow-lg !shadow-green-500/20' : ''} ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {addedToCart ? (
                <>{t('btn.added')}</>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {t('btn.addToCart')}
                </>
              )}
            </button>
          </div>

          {/* Quick buy */}
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className={`btn-secondary w-full ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('btn.buyNow')}
          </button>

          {/* Telegram CTA */}
          <div className="mt-6 glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#2AABEE]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#2AABEE]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.14-5.062 3.345-.479.329-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.098.153.228.168.327.016.099.035.323.02.498z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{t('support.questions')}</p>
              <p className="text-xs text-text-muted">{t('support.writeUs')}</p>
            </div>
            <a
              href="https://t.me/JPGSTYLE_SMARTWASH"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              {t('support.btn')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
