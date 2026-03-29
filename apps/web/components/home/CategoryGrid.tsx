'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { categories } from '@/lib/data';
import { useLanguage } from '@/lib/i18n';

export function CategoryGrid() {
  const { t } = useLanguage();
  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">{t('catalog.title')}</h2>
        <p className="text-text-muted">{t('catalog.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/categories/${cat.slug}`}
              className="group block glass-card overflow-hidden hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="relative h-32 overflow-hidden bg-primary-light">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-heading font-semibold text-white text-sm mb-1 group-hover:text-accent transition-colors">
                  {t(`cat.${cat.slug}`)}
                </h3>
                <p className="text-xs text-text-muted">{cat.productCount} {t('catalog.itemsCount')}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
