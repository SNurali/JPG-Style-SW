'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

const steps = [
  {
    step: '01',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    titleKey: 'howItWorks.1.title',
    descKey: 'howItWorks.1.desc',
  },
  {
    step: '02',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    titleKey: 'howItWorks.2.title',
    descKey: 'howItWorks.2.desc',
  },
  {
    step: '03',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    titleKey: 'howItWorks.3.title',
    descKey: 'howItWorks.3.desc',
  },
];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title mb-3">{t('howItWorks.title')}</h2>
        <p className="text-text-muted max-w-xl mx-auto">{t('howItWorks.subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        {steps.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="text-center relative"
          >
            {/* Step number */}
            <div className="relative inline-flex mb-6">
              <motion.div
                className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center text-white relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
              </motion.div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-surface border border-accent/30 flex items-center justify-center text-xs font-bold text-accent z-20">
                {item.step}
              </div>
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-xl" />
            </div>

            <h3 className="font-heading font-semibold text-white text-lg mb-2">{t(item.titleKey)}</h3>
            <p className="text-sm text-text-muted max-w-xs mx-auto">{t(item.descKey)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
