'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviews } from '@/lib/data';
import { useLanguage } from '@/lib/i18n';

export function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();

  return (
    <section id="reviews" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">⭐ {t('reviews.title')}</h2>
        <p className="text-text-muted">{t('reviews.subtitle')}</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Review card */}
        <div className="glass-card p-8 sm:p-10 relative">
          <div className="absolute top-6 right-8 text-6xl text-accent/10 font-heading">"</div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < reviews[activeIndex].rating ? 'text-yellow-400' : 'text-white/10'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-white text-lg mb-6 leading-relaxed italic">
                "{reviews[activeIndex].comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-sm font-bold text-white">
                  {reviews[activeIndex].customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{reviews[activeIndex].customerName}</p>
                  <p className="text-xs text-text-muted">{reviews[activeIndex].productName}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-accent w-8' : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
