'use client';

import React from 'react';
import Link from 'next/link';
import { categories, getProductsByCategory, getCategoryBySlug } from '@/lib/data';
import { ProductCard } from '@/components/product/ProductCard';
import { useLanguage } from '@/lib/i18n';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  const categoryProducts = getProductsByCategory(params.slug);
  const { t } = useLanguage();

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="section-title mb-4">{t('category.notFound')}</h1>
        <Link href="/categories" className="btn-primary">{t('category.all')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-accent transition-colors">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-accent transition-colors">{t('nav.catalog')}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{t(`cat.${category.slug}`)}</span>
      </nav>

      {/* Category header */}
      <div className="glass-card p-8 mb-8">
        <h1 className="section-title mb-2">{t(`cat.${category.slug}`)}</h1>
        <p className="text-text-muted">{t(`catDesc.${category.slug}`)}</p>
        <p className="text-sm text-accent mt-2">{categoryProducts.length} {t('catalog.itemsCount')}</p>
      </div>

      {/* Products grid */}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg mb-4">{t('category.comingSoon')}</p>
          <Link href="/categories" className="btn-primary">{t('category.all')}</Link>
        </div>
      )}
    </div>
  );
}
