import React from 'react';

export default function PaymentPage() {
  return (
    <div className="min-h-[60vh] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-white mb-6">Оплата</h1>

        <div className="glass-card p-8 space-y-6 text-text-muted leading-relaxed">
          <h2 className="font-heading text-xl font-semibold text-white">Способы оплаты</h2>

          <div className="space-y-4">
            <div className="bg-white/[0.03] rounded-xl p-4">
              <h3 className="font-medium text-white mb-1">Click</h3>
              <p>Онлайн-оплата через мобильное приложение Click. Быстро, удобно, безопасно.</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <h3 className="font-medium text-white mb-1">Payme</h3>
              <p>Оплата через Payme — ещё один удобный способ рассчитаться за заказ.</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <h3 className="font-medium text-white mb-1">Наличные</h3>
              <p>Оплата наличными курьеру при получении заказа.</p>
            </div>
          </div>

          <h2 className="font-heading text-xl font-semibold text-white">Безопасность</h2>
          <p>
            Все онлайн-платежи проходят через защищённые каналы. Мы не храним данные
            ваших банковских карт — обработка платежей осуществляется напрямую через
            платёжные системы Click и Payme.
          </p>

          <p className="text-sm text-text-muted">
            По вопросам оплаты: <a href="tel:+998501040026" className="text-accent hover:underline">+998 50 104 00 26</a>
          </p>
        </div>
      </div>
    </div>
  );
}
