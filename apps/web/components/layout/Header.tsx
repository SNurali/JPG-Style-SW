'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/i18n';
import { searchProducts } from '@/lib/api';
import type { Product } from 'shared/types';

/* ──────────────────────────────────────────────────────────
   Premium Logo Component – renders inline SVG for maximum
   control over gradients, hover effects, and responsive
   behaviour without external image dependencies.
   ────────────────────────────────────────────────────────── */

function LogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`logo-wrapper ${className}`}>
      {/* SW Monogram */}
      <div className="logo-monogram" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
          <defs>
            <linearGradient id="hdr-chrome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#e8e8e8" />
              <stop offset="60%" stopColor="#d0d0d0" />
              <stop offset="100%" stopColor="#b8b8b8" />
            </linearGradient>
            <linearGradient id="hdr-accent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4361ee" />
              <stop offset="100%" stopColor="#3a56d4" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="46" height="46" rx="11" fill="url(#hdr-accent)" fillOpacity="0.1" />
          <rect x="1" y="1" width="46" height="46" rx="11" stroke="url(#hdr-accent)" strokeWidth="1.2" strokeOpacity="0.35" />
          <text x="8" y="35" fontFamily="Inter, Helvetica Neue, Arial, sans-serif" fontWeight="800" fontSize="27" fill="url(#hdr-chrome)" letterSpacing="-1">SW</text>
        </svg>
      </div>

      {/* Text block */}
      <div className="logo-text-block">
        <span className="logo-sub">JPG STYLE</span>
        <span className="logo-main">SMARTWASH</span>
        <span className="logo-accent-bar" aria-hidden="true" />
      </div>
    </div>
  );
}

function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`logo-icon-wrapper ${className}`}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <defs>
          <linearGradient id="hdr-chrome-m" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#e8e8e8" />
            <stop offset="60%" stopColor="#d0d0d0" />
            <stop offset="100%" stopColor="#b8b8b8" />
          </linearGradient>
          <linearGradient id="hdr-accent-m" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4361ee" />
            <stop offset="100%" stopColor="#3a56d4" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="46" height="46" rx="11" fill="url(#hdr-accent-m)" fillOpacity="0.1" />
        <rect x="1" y="1" width="46" height="46" rx="11" stroke="url(#hdr-accent-m)" strokeWidth="1.2" strokeOpacity="0.35" />
        <text x="8" y="35" fontFamily="Inter, Helvetica Neue, Arial, sans-serif" fontWeight="800" fontSize="27" fill="url(#hdr-chrome-m)" letterSpacing="-1">SW</text>
      </svg>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const [isBumping, setIsBumping] = useState(false);
  const isFirstRender = useRef(true);
  const { language, setLanguage, t } = useLanguage();

  // Bump cart icon when totalItems changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (totalItems > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchProducts(searchQuery);
          setSearchResults(results.data || results || []);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchResultClick = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/products/${slug}`);
  };

  return (
    <header id="site-header" className={`sticky top-0 z-50 header-glass border-b border-white/[0.06] transition-all duration-300 ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          {/* ─── Logo ─── */}
          <Link href="/" className="flex items-center group logo-link" id="header-logo">
            {/* Full logo: visible ≥ 640px */}
            <LogoFull className="hidden sm:flex" />
            {/* Icon only: visible < 640px */}
            <LogoIcon className="flex sm:hidden" />
          </Link>

          {/* ─── Desktop Nav ─── */}
          <nav className="hidden md:flex items-center gap-1" id="header-nav">
            <Link href="/" className="nav-link">{t('nav.home')}</Link>
            <Link href="/categories" className="nav-link">{t('nav.catalog')}</Link>
            <Link href="/#bestsellers" className="nav-link">{t('nav.bestsellers')}</Link>
            <Link href="/#reviews" className="nav-link">{t('nav.reviews')}</Link>
          </nav>

          {/* ─── Actions ─── */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Switcher */}
            <div className="relative group/lang" id="lang-switcher">
              <button className="header-action-btn text-xs font-semibold tracking-wide uppercase gap-1" aria-label="Select language">
                {language === 'ru' ? 'RU' : language === 'uz' ? 'UZ' : language === 'uz-cy' ? 'ЎЗ' : 'EN'}
                <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-36 bg-[#16182a] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-200 backdrop-blur-xl">
                <button onClick={() => setLanguage('ru')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.04] transition-colors ${language === 'ru' ? 'text-accent' : 'text-text-main'}`}>🇷🇺 Русский</button>
                <button onClick={() => setLanguage('uz')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.04] transition-colors ${language === 'uz' ? 'text-accent' : 'text-text-main'}`}>🇺🇿 O&apos;zbekcha</button>
                <button onClick={() => setLanguage('uz-cy')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.04] transition-colors ${language === 'uz-cy' ? 'text-accent' : 'text-text-main'}`}>🇺🇿 Ўзбекча</button>
                <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.04] transition-colors ${language === 'en' ? 'text-accent' : 'text-text-main'}`}>🇬🇧 English</button>
              </div>
            </div>

            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="header-action-btn"
              aria-label="Search"
              id="search-toggle"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className={`header-action-btn relative ${isBumping ? 'scale-110 !text-accent' : ''}`}
              id="cart-button"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-accent rounded-full text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-[#0f0f23] transition-transform ${isBumping ? 'scale-125' : 'scale-100'}`}>
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden header-action-btn"
              aria-label="Menu"
              id="mobile-menu-toggle"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ─── Search bar with Autocomplete ─── */}
        {searchOpen && (
          <div ref={searchRef} className="pb-4 animate-slide-up relative z-50">
            <div className="relative">
              <input
                type="search"
                placeholder={t('header.search')}
                className="input-field pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                id="search-input"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div className="absolute top-14 left-0 right-0 bg-[#16182a] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <ul className="divide-y divide-white/[0.04]">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <button
                          onClick={() => handleSearchResultClick(product.slug)}
                          className="w-full text-left flex items-center gap-4 p-3 hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="w-12 h-12 bg-surface-lighter rounded-lg flex-shrink-0 relative overflow-hidden">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full gradient-accent opacity-20"></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-white text-sm font-medium truncate">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-text-muted">{product.sku}</span>
                              <span className="text-accent text-xs font-bold">{product.price.toLocaleString()} сўм</span>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !isSearching && (
                    <div className="p-4 text-center text-text-muted text-sm">
                      Ничего не найдено по запросу &quot;{searchQuery}&quot;
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── Mobile menu ─── */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-5 animate-slide-up border-t border-white/[0.06] pt-4">
            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">{t('nav.home')}</Link>
              <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">{t('nav.catalog')}</Link>
              <Link href="/#bestsellers" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">{t('nav.bestsellers')}</Link>
              <Link href="/#reviews" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">{t('nav.reviews')}</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
