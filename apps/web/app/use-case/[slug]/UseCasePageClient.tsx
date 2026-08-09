'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice, type Product } from '@/lib/data';
import type { UseCase } from '@/lib/use-case-data';

const TELEGRAM_URL = 'https://t.me/JPGSTYLE_SMARTWASH';

export function UseCasePageClient({
  useCase,
  products,
}: {
  useCase: UseCase;
  products: Product[];
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-accent transition-colors">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-accent transition-colors">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{useCase.title}</span>
      </nav>

      {/* Hero */}
      <section className="glass-card p-8 sm:p-12 mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-4 leading-tight">
          {useCase.h1}
        </h1>
        <p className="text-text-muted text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
          {useCase.intro}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/categories" className="btn-primary">
            Смотреть каталог
          </Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Заказать в Telegram
          </a>
        </div>
      </section>

      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
          {useCase.sections.map((section, i) => (
            <article key={i} className="glass-card p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-4">
                {section.heading}
              </h2>
              <p className="text-text-muted leading-relaxed">{section.body}</p>
            </article>
          ))}
        </div>

        {/* Sidebar: quick info */}
        <aside className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              Преимущества SmartWash
            </h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Профессиональные формулы</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Доставка в день заказа</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Оптовые цены</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>50+ автомоек-партнёров</span>
              </li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              Нужна консультация?
            </h3>
            <p className="text-sm text-text-muted mb-4">
              Напишите нам в Telegram — подберём состав под вашу задачу и бюджет.
            </p>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center block"
            >
              Написать в Telegram
            </a>
          </div>
        </aside>
      </div>

      {/* Products */}
      {products.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6">
            Рекомендуемые товары
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {useCase.faq.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6">
            Часто задаваемые вопросы
          </h2>
          <div className="space-y-4">
            {useCase.faq.map((item, i) => (
              <details key={i} className="glass-card group">
                <summary className="p-6 cursor-pointer font-heading font-semibold text-white list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-accent text-xl transition-transform group-open:rotate-45 ml-4 shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 -mt-2">
                  <p className="text-text-muted leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="glass-card p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
          Готовы заказать?
        </h2>
        <p className="text-text-muted mb-6 max-w-2xl mx-auto">
          Свяжитесь с нами через Telegram или по телефону. Доставка по Ташкенту в день заказа, по Узбекистану — 1–3 дня.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Заказать в Telegram
          </a>
          <a href="tel:+998990309986" className="btn-secondary">
            +998 99 030 99 86
          </a>
        </div>
      </section>
    </div>
  );
}
