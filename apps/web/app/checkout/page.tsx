'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/i18n';
import { formatPrice } from '@/lib/data';
import { createOrder, validateDiscount } from '@/lib/api';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const [selectedZoneId, setSelectedZoneId] = useState('1');
  const [selectedPaymentId, setSelectedPaymentId] = useState('cash');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Discount
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Delivery zones using translations
  const deliveryZones = [
    { id: '1', nameKey: 'delivery.center', price: 15000, timeKey: 'delivery.centerTime' },
    { id: '2', nameKey: 'delivery.near', price: 25000, timeKey: 'delivery.nearTime' },
    { id: '3', nameKey: 'delivery.far', price: 35000, timeKey: 'delivery.farTime' },
    { id: '4', nameKey: 'delivery.bts', price: 0, timeKey: 'delivery.btsTime' },
    { id: '5', nameKey: 'delivery.pickup', price: 0, timeKey: '' },
  ];

  const paymentMethods = [
    { id: 'cash', nameKey: 'payment.cash', icon: '💵' },
    { id: 'click', name: 'Click', icon: '📱' },
    { id: 'payme', name: 'Payme', icon: '📱' },
  ];

  const selectedZone = deliveryZones.find(z => z.id === selectedZoneId) || deliveryZones[0];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
       alert(t('geo.notSupported'));
       return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        alert(t('geo.error'));
        setLocationLoading(false);
      }
    );
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountError('');
    try {
      const result = await validateDiscount(discountCode, totalPrice);
      if (result.data.valid) {
        setDiscountAmount(result.data.discountAmount);
        setDiscountApplied(true);
      } else {
        setDiscountError(result.data.error);
        setDiscountAmount(0);
        setDiscountApplied(false);
      }
    } catch (err: any) {
      setDiscountError(err.message || t('checkout.promoError'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const customerName = `${form.firstName} ${form.lastName}`.trim();
      const result = await createOrder({
        customerName,
        customerPhone: form.phone,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        deliveryAddress: form.address,
        deliveryZone: t(selectedZone.nameKey),
        deliveryFee: selectedZone.price,
        paymentMethod: selectedPaymentId,
        notes: form.notes,
        discountCode: discountApplied ? discountCode : undefined,
        location: location || undefined,
      });

      setOrderNumber(result.data.orderNumber);
      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || t('checkout.orderError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="section-title mb-4">{t('cart.empty')}</h1>
        <p className="text-text-muted mb-8">{t('checkout.emptyHint')}</p>
        <Link href="/categories" className="btn-primary">{t('hero.goToCatalog')}</Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-10">
          <div className="text-6xl mb-6 animate-float">✅</div>
          <h1 className="section-title mb-4">{t('order.placed')}</h1>
          <p className="text-text-muted mb-2">{t('order.number')}</p>
          <p className="font-heading text-3xl font-bold text-accent mb-6">{orderNumber}</p>
          <p className="text-text-muted mb-8">
            {t('order.contactSoon')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">{t('order.toHome')}</Link>
            <a
              href="https://t.me/JPGSTYLE_SMARTWASH"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.14-5.062 3.345-.479.329-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.098.153.228.168.327.016.099.035.323.02.498z"/>
              </svg>
              {t('order.writeTelegram')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const deliveryPrice = selectedZone.price;
  const grandTotal = totalPrice - discountAmount + deliveryPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-accent transition-colors">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-accent transition-colors">{t('cart.title')}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{t('checkout.title')}</span>
      </nav>

      <h1 className="section-title mb-8">{t('checkout.title')}</h1>

      {error && (
        <div className="mb-6 p-4 rounded-card bg-danger/10 border border-danger/20 text-danger text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact info */}
            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold text-white mb-4">📋 {t('checkout.contact')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-1">{t('checkout.firstName')} *</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="input-field"
                    placeholder={t('checkout.firstNamePh')}
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">{t('checkout.lastName')}</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="input-field"
                    placeholder={t('checkout.lastNamePh')}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-text-muted mb-1">{t('checkout.phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field"
                    placeholder="+998 __ ___ __ __"
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold text-white mb-4">🚚 {t('delivery.title')}</h3>
              <div className="space-y-3 mb-4">
                {deliveryZones.map((zone) => (
                  <label
                    key={zone.id}
                    className={`flex items-center gap-4 p-4 rounded-card border cursor-pointer transition-all ${
                      selectedZoneId === zone.id ? 'border-accent bg-accent/5' : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={selectedZoneId === zone.id}
                      onChange={() => setSelectedZoneId(zone.id)}
                      className="accent-accent"
                    />
                    <div className="flex-1">
                      <span className="text-white text-sm font-medium">{t(zone.nameKey)}</span>
                      {zone.timeKey && <span className="text-xs text-text-muted ml-2">({t(zone.timeKey)})</span>}
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {zone.price === 0 ? (zone.id === '5' ? t('delivery.free') : t('delivery.btsTime')) : formatPrice(zone.price, t('currency'))}
                    </span>
                  </label>
                ))}
              </div>

              {selectedZoneId !== '5' && (
                <div>
                  <label className="block text-sm text-text-muted mb-1">{t('delivery.address')} *</label>
                  <input
                    type="text"
                    required={selectedZoneId !== '5'}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="input-field mb-2"
                    placeholder={t('delivery.addressPh')}
                  />
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-card border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📍</span>
                      <div className="text-sm">
                        <p className="text-white font-medium">{t('delivery.sendLocation')}</p>
                        <p className="text-xs text-text-muted">
                          {location ? t('delivery.locationReceived') : t('delivery.locationHint')}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={locationLoading}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      {locationLoading ? t('delivery.locationLoading') : location ? t('delivery.locationRefresh') : t('delivery.locationShare')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold text-white mb-4">💳 {t('payment.title')}</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-card border cursor-pointer transition-all ${
                      selectedPaymentId === method.id ? 'border-accent bg-accent/5' : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPaymentId === method.id}
                      onChange={() => setSelectedPaymentId(method.id)}
                      className="accent-accent"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-white text-sm font-medium">
                      {method.nameKey ? t(method.nameKey) : method.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Promo code */}
            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold text-white mb-4">🏷️ {t('promo.title')}</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => { setDiscountCode(e.target.value); setDiscountApplied(false); setDiscountError(''); }}
                  className="input-field flex-1"
                  placeholder={t('promo.placeholder')}
                  disabled={discountApplied}
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  disabled={discountApplied}
                  className={`btn-secondary whitespace-nowrap ${discountApplied ? 'text-green-400 border-green-400/30' : ''}`}
                >
                  {discountApplied ? t('promo.applied') : t('promo.apply')}
                </button>
              </div>
              {discountError && <p className="text-sm text-danger mt-2">{discountError}</p>}
              {discountApplied && <p className="text-sm text-green-400 mt-2">{t('promo.discount')}: -{formatPrice(discountAmount, t('currency'))}</p>}
            </div>

            {/* Notes */}
            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold text-white mb-4">📝 {t('notes.title')}</h3>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field min-h-[100px] resize-none"
                placeholder={t('notes.placeholder')}
              />
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="font-heading font-semibold text-white mb-4">{t('order.yourOrder')}</h3>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-text-muted truncate flex-1 mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-white flex-shrink-0">{formatPrice(item.price * item.quantity, t('currency'))}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">{t('cart.items')}</span>
                  <span className="text-white">{formatPrice(totalPrice, t('currency'))}</span>
                </div>
                {discountApplied && discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">{t('promo.discount')}</span>
                    <span className="text-green-400">-{formatPrice(discountAmount, t('currency'))}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">{t('delivery.title')}</span>
                  <span className="text-white">
                    {deliveryPrice === 0 ? t('delivery.free') : formatPrice(deliveryPrice, t('currency'))}
                  </span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between">
                  <span className="font-semibold text-white">{t('cart.total')}</span>
                  <span className="font-heading font-bold text-white text-xl">{formatPrice(grandTotal, t('currency'))}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary w-full mt-6 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isSubmitting ? t('order.processing') : t('order.confirm')}
              </button>

              <p className="text-xs text-text-muted text-center mt-4">
                {t('order.terms')}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
