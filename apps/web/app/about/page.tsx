import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-[60vh] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-white mb-6">О нас</h1>

        <div className="glass-card p-8 space-y-6 text-text-muted leading-relaxed">
          <p>
            <strong className="text-white">JPG Style SmartWash</strong> — профессиональная автохимия
            премиум-класса из Узбекистана. Мы производим и поставляем средства для детейлинга,
            которые используют автомойки, детейлинг-центры и автолюбители по всему Ташкенту.
          </p>

          <h2 className="font-heading text-xl font-semibold text-white">Наша миссия</h2>
          <p>
            Дать профессионалам и автолюбителям доступ к качественной автохимии по честным ценам.
            Мы уверены: каждая машина заслуживает идеального ухода.
          </p>

          <h2 className="font-heading text-xl font-semibold text-white">Почему выбирают нас</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Собственное производство — контроль качества на каждом этапе</li>
            <li>Доступные цены от 22 500 сум за разливной автошампунь</li>
            <li>Широкий ассортимент: шампуни, воски, чернители, нано-покрытия</li>
            <li>Доставка по Ташкенту в день заказа</li>
            <li>Бесплатная доставка от 500 000 сум</li>
            <li>Работаем с автомойками и детейлинг-центрами оптом</li>
          </ul>

          <h2 className="font-heading text-xl font-semibold text-white">Наши ценности</h2>
          <p>
            Качество. Честность. Забота о клиенте. Мы не гонимся за количеством —
            каждый продукт проходит проверку, прежде чем попасть на полку.
          </p>

          <p className="text-sm">
            По всем вопросам: <a href="tel:+998501040026" className="text-accent hover:underline">+998 50 104 00 26</a>
          </p>
        </div>
      </div>
    </div>
  );
}
