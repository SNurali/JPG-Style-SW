'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { fetchMyOrders, updateMyProfile } from '@/lib/api';

const STATUS_RU: Record<string, string> = {
  pending: 'Новый', confirmed: 'Подтверждён', processing: 'В обработке',
  delivering: 'Доставка', delivered: 'Доставлен', cancelled: 'Отменён',
};

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, logout, setUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) { setName(user.name || ''); setPhone(user.phone || ''); }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchMyOrders()
      .then((r) => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [user]);

  if (isLoading || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center text-text-muted">Загрузка...</div>;
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const { data } = await updateMyProfile({ name, phone: phone || undefined });
      setUser(data);
      setMsg('Сохранено ✓');
    } catch (err: any) {
      setMsg(err.message || 'Ошибка сохранения');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-white">Личный кабинет</h1>
        <button onClick={() => { logout(); router.push('/'); }} className="btn-secondary text-sm">Выйти</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Профиль */}
        <div className="glass-card p-6">
          <h2 className="font-heading text-lg font-semibold text-white mb-4">Профиль</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Имя</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Email</label>
              <input value={user.email || '—'} disabled className="input-field opacity-60" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Телефон</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+998 __ ___ __ __" />
            </div>
            {msg && <p className="text-sm text-accent">{msg}</p>}
            <button type="submit" disabled={saving} className={`btn-primary w-full ${saving ? 'opacity-70' : ''}`}>
              {saving ? 'Сохраняем...' : 'Сохранить'}
            </button>
            {user.googleLinked && <p className="text-xs text-text-muted text-center">Аккаунт привязан к Google</p>}
          </form>
        </div>

        {/* История заказов */}
        <div className="glass-card p-6">
          <h2 className="font-heading text-lg font-semibold text-white mb-4">Мои заказы</h2>
          {loadingOrders ? (
            <p className="text-text-muted text-sm">Загрузка заказов...</p>
          ) : orders.length === 0 ? (
            <p className="text-text-muted text-sm">У вас пока нет заказов.</p>
          ) : (
            <ul className="space-y-3 max-h-[420px] overflow-y-auto">
              {orders.map((o) => (
                <li key={o.orderNumber} className="rounded-xl border border-white/[0.06] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-semibold">№ {o.orderNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent">{STATUS_RU[o.status] || o.status}</span>
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    {new Date(o.createdAt).toLocaleDateString('ru-RU')} · {(o.items?.length || 0)} тов. ·{' '}
                    <span className="text-white font-semibold">{Number(o.total).toLocaleString('ru-RU')} сум</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
