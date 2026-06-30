import React from 'react';

export default function DeliveryPage() {
  return (
    <div className="min-h-[60vh] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-white mb-6">Доставка</h1>

        <div className="glass-card p-8 space-y-6 text-text-muted leading-relaxed">
          <h2 className="font-heading text-xl font-semibold text-white">Условия доставки</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Доставка осуществляется по Ташкенту</li>
            <li>Бесплатная доставка при заказе от 500 000 сум</li>
            <li>Доставка в день заказа при оформлении до 16:00</li>
            <li>Возможна доставка в регионы — уточняйте у менеджера</li>
          </ul>

          <h2 className="font-heading text-xl font-semibold text-white">Способы доставки</h2>
          <div className="space-y-4">
            <div className="bg-white/[0.03] rounded-xl p-4">
              <h3 className="font-medium text-white mb-1">Курьерская доставка</h3>
              <p>Наш курьер привезёт заказ по указанному адресу в течение дня.</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <h3 className="font-medium text-white mb-1">Самовывоз</h3>
              <p>Вы можете забрать заказ самостоятельно. Адрес уточняйте по телефону.</p>
            </div>
          </div>

          <h2 className="font-heading text-xl font-semibold text-white">Сроки доставки</h2>
          <p>
            Обычно доставка занимает от 1 до 6 часов с момента подтверждения заказа.
            В редких случаях (высокая загрузка, погодные условия) срок может быть увеличен до 24 часов.
          </p>

          <p className="text-sm">
            Контакты для связи: <a href="tel:+998501040026" className="text-accent hover:underline">+998 50 104 00 26</a>
          </p>
        </div>
      </div>
    </div>
  );
}
