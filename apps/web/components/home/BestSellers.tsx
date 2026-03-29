'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getBestsellers } from '@/lib/data';
import { ProductCard } from '@/components/product/ProductCard';
import { useLanguage } from '@/lib/i18n';

export function BestSellers() {
  const bestsellers = getBestsellers();
  const { t } = useLanguage();

  return (
    <section id="bestsellers" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <span>🔥</span> {t('bestsellers.title')}
          </h2>
          <p className="text-text-muted mt-2">{t('bestsellers.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {bestsellers.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
