'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/i18n';
import { formatPrice, type Product } from '@/lib/data';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <motion.div
        className="glass-card overflow-hidden product-card-glow"
        style={{
          transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
      >
        {/* Image container */}
        <div className="relative aspect-square bg-primary-light overflow-hidden">
          {/* Product image */}
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Hover overlay */}
          <div className="img-hover-overlay" />

          {/* Gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-500/5 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isBestseller && (
              <motion.span
                className="badge-bestseller"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                🔥 {t('bestsellers.hitLabel')}
              </motion.span>
            )}
            {product.isNew && (
              <motion.span
                className="badge-new"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ✨ {t('new.newLabel')}
              </motion.span>
            )}
            {product.compareAtPrice && (
              <motion.span
                className="badge bg-danger text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
              </motion.span>
            )}
          </div>

          {/* Stock warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <motion.div
              className="absolute bottom-3 left-3 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="badge-stock-low">{t('product.stockLeft')} {product.stock} {t('product.pcs')}</span>
            </motion.div>
          )}

          {/* Quick add overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <motion.button
              onClick={handleAddToCart}
              className={`btn-primary text-sm py-2.5 px-6 ${isAdded ? '!bg-green-500 !border-green-500 !text-white' : ''}`}
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isAdded ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {isAdded ? t('btn.added') : t('btn.addToCart')}
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-text-muted mb-1">{t(`cat.${product.categorySlug}`)}</p>
          <h3 className="font-heading font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
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
            <span className="font-heading font-bold text-white text-lg">{formatPrice(product.price, t('currency'))}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-text-muted line-through">{formatPrice(product.compareAtPrice, t('currency'))}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
