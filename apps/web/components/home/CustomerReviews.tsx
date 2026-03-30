'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviews } from '@/lib/data';
import { useLanguage } from '@/lib/i18n';

export function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title mb-3">⭐ {t('reviews.title')}</h2>
        <p className="text-text-muted max-w-xl mx-auto">{t('reviews.subtitle')}</p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          className="glass-card review-card p-8 sm:p-10 relative"
          layout
        >
          {/* Decorative quote */}
          <div className="absolute top-6 right-8 text-7xl font-heading text-accent/10 select-none pointer-events-none">"</div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    className={`w-5 h-5 ${i < reviews[activeIndex].rating ? 'text-yellow-400' : 'text-white/10'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-white text-lg mb-6 leading-relaxed italic">
                "{reviews[activeIndex].comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-11 h-11 rounded-full gradient-accent flex items-center justify-center text-sm font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  {reviews[activeIndex].customerName.charAt(0)}
                </motion.div>
                <div>
                  <p className="font-semibold text-white text-sm">{reviews[activeIndex].customerName}</p>
                  <p className="text-xs text-text-muted">{reviews[activeIndex].productName}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-accent' : 'bg-white/20 hover:bg-white/40'
              }`}
              style={{
                width: i === activeIndex ? 32 : 10,
                height: 10,
              }}
              aria-label={`Review ${i + 1}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
