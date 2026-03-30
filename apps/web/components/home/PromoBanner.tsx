'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

export function PromoBanner() {
  const { t } = useLanguage();

  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(67, 97, 238, 0.15) 0%, rgba(108, 99, 255, 0.1) 50%, rgba(230, 57, 70, 0.08) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top right, rgba(67, 97, 238, 0.2), transparent 60%)',
        }} />

        {/* Animated blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl" style={{ animation: 'blob 8s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-danger/10 blur-3xl" style={{ animation: 'blob 10s ease-in-out infinite reverse' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <motion.h3
              className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              🚚 {t('promoBanner.title')}
            </motion.h3>
            <motion.p
              className="text-text-muted text-sm sm:text-base max-w-md"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t('promoBanner.desc')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/categories" className="btn-primary px-8 py-3 text-base whitespace-nowrap ripple">
              {t('promoBanner.btn')}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
