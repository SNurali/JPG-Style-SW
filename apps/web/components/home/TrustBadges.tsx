'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

export function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    { icon: '✅', title: t('features.1.title'), description: t('features.1.desc') },
    { icon: '🏆', title: t('features.2.title'), description: t('features.2.desc') },
    { icon: '🚀', title: t('features.3.title'), description: t('features.3.desc') },
    { icon: '💬', title: t('features.4.title'), description: t('features.4.desc') },
    { icon: '🔄', title: t('features.5.title'), description: t('features.5.desc') },
    { icon: '💳', title: t('features.6.title'), description: t('features.6.desc') },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">{t('features.title')}</h2>
        <p className="text-text-muted">{t('features.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            viewport={{ once: true }}
            className="glass-card p-6 text-center hover:border-accent/20 transition-all duration-300"
          >
            <div className="text-3xl mb-3">{badge.icon}</div>
            <h3 className="font-heading font-semibold text-white text-sm mb-1">{badge.title}</h3>
            <p className="text-xs text-text-muted">{badge.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
