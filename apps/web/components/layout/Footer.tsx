'use client';

import React from 'react';
import Link from 'next/link';
import { categories } from '@/lib/data';
import { useLanguage } from '@/lib/i18n';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5 logo-wrapper group">
              {/* SW Monogram */}
              <div className="logo-monogram" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                  <defs>
                    <linearGradient id="ftr-chrome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#e8e8e8" />
                      <stop offset="60%" stopColor="#d0d0d0" />
                      <stop offset="100%" stopColor="#b8b8b8" />
                    </linearGradient>
                    <linearGradient id="ftr-accent" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4361ee" />
                      <stop offset="100%" stopColor="#3a56d4" />
                    </linearGradient>
                  </defs>
                  <rect x="1" y="1" width="46" height="46" rx="11" fill="url(#ftr-accent)" fillOpacity="0.1" />
                  <rect x="1" y="1" width="46" height="46" rx="11" stroke="url(#ftr-accent)" strokeWidth="1.2" strokeOpacity="0.35" />
                  <text x="8" y="35" fontFamily="Inter, Helvetica Neue, Arial, sans-serif" fontWeight="800" fontSize="27" fill="url(#ftr-chrome)" letterSpacing="-1">SW</text>
                </svg>
              </div>
              {/* Text block */}
              <div className="logo-text-block">
                <span className="logo-sub">JPG STYLE</span>
                <span className="logo-main">SMARTWASH</span>
                <span className="logo-accent-bar" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">{t('nav.catalog')}</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categories/${cat.slug}`} className="text-sm text-text-muted hover:text-accent transition-colors">
                    {t(`cat.${cat.slug}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">{t('footer.info')}</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-text-muted hover:text-accent transition-colors">{t('footer.about')}</Link></li>
              <li><Link href="/delivery" className="text-sm text-text-muted hover:text-accent transition-colors">{t('footer.delivery')}</Link></li>
              <li><Link href="/payment" className="text-sm text-text-muted hover:text-accent transition-colors">{t('footer.payment')}</Link></li>
              <li><Link href="/contacts" className="text-sm text-text-muted hover:text-accent transition-colors">{t('footer.contacts')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://t.me/JPGSTYLE_SMARTWASH" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.14-5.062 3.345-.479.329-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.098.153.228.168.327.016.099.035.323.02.498z"/>
                  </svg>
                  {t('footer.telegram')}
                </a>
              </li>
              <li>
                <a href="tel:+998990309986" className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +998 99 030 99 86
                </a>
              </li>
              <li>
                <a href="tel:+998501040026" className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +998 50 104 00 26
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('footer.address')}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © 2026 JPG Style SmartWash. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">{t('footer.weAccept')}</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded bg-white/5 text-xs text-text-muted font-medium">Click</span>
              <span className="px-2 py-1 rounded bg-white/5 text-xs text-text-muted font-medium">Payme</span>
              <span className="px-2 py-1 rounded bg-white/5 text-xs text-text-muted font-medium">{t('payment.cash')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
