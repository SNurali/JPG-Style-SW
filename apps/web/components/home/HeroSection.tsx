'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-primary to-surface" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger/10 rounded-full blur-[120px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-medium">JPG-Style SmartWash</span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/categories" className="btn-primary text-lg px-8 py-4">
              {t('hero.goToCatalog')}
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-smartbot'))}
              className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
            >
              {t('hero.askBot')}
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '500+', label: t('stats.clients') },
              { value: '50+', label: t('stats.products') },
              { value: '1000+', label: t('stats.orders') },
              { value: '4.8⭐', label: t('stats.rating') },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent" />
    </section>
  );
}
