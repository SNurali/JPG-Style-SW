import React from 'react';

export default function ContactsPage() {
  return (
    <div className="min-h-[60vh] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-white mb-6">Контакты</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-heading text-xl font-semibold text-white">Связаться с нами</h2>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Телефон 1</p>
                <a href="tel:+998990309986" className="text-accent hover:underline text-lg font-medium">+998 99 030 99 86</a>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Телефон 2</p>
                <a href="tel:+998501040026" className="text-accent hover:underline text-lg font-medium">+998 50 104 00 26</a>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Telegram</p>
                <a href="https://t.me/JPGSTYLE_SMARTWASH" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  @JPGSTYLE_SMARTWASH
                </a>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Адрес</p>
                <p className="text-white">Ташкент, Узбекистан</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-heading text-xl font-semibold text-white">Часы работы</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Пн — Пт</span>
                <span className="text-white">09:00 — 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Суббота</span>
                <span className="text-white">10:00 — 17:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Воскресенье</span>
                <span className="text-white">Выходной</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <h3 className="font-medium text-white mb-2">Оптовые закупки</h3>
              <p className="text-sm text-text-muted">
                Для автомоек, детейлинг-центров и магазинов — специальные цены при заказе от 10 единиц.
                Звоните для обсуждения условий.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
