'use client';

import React from 'react';
import Link from 'next/link';
import { categories } from '@/lib/data';
import { useLanguage } from '@/lib/i18n';

export default function CategoriesPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-accent transition-colors">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{t('nav.catalog')}</span>
      </nav>

      <h1 className="section-title mb-8">{t('category.all')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group glass-card overflow-hidden hover:border-accent/30 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Category image */}
            <div className="h-40 relative overflow-hidden">
              <img
                src={cat.image}
                alt={t(`cat.${cat.slug}`)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
            </div>
            <div className="p-5">
              <h2 className="font-heading font-semibold text-white mb-1 group-hover:text-accent transition-colors">
                {t(`cat.${cat.slug}`)}
              </h2>
              <p className="text-sm text-text-muted mb-2">{t(`catDesc.${cat.slug}`)}</p>
              <span className="text-xs text-accent">{cat.productCount} {t('catalog.itemsCount')} →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
