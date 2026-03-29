'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { useAdminApi } from '@/lib/auth';

function formatPrice(price: number) {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' сўм';
}

export default function DiscountsPage() {
  const api = useAdminApi();
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: 10, minOrder: 0, maxUses: 100 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api('/api/admin/discounts');
      setDiscounts(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    try {
      await api('/api/admin/discounts', { method: 'POST', body: JSON.stringify(form) });
      setShowForm(false);
      setForm({ code: '', type: 'percentage', value: 10, minOrder: 0, maxUses: 100 });
      load();
    } catch (err) { console.error(err); }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await api(`/api/admin/discounts/${id}`, { method: 'PUT', body: JSON.stringify({ isActive: !isActive }) });
      load();
    } catch (err) { console.error(err); }
  };

  const deleteDiscount = async (id: string) => {
    try {
      await api(`/api/admin/discounts/${id}`, { method: 'DELETE' });
      load();
    } catch (err) { console.error(err); }
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title text-2xl">Скидки</h1>
          <p className="text-text-muted text-sm mt-1">Управление промокодами</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Отменить' : '+ Новый промокод'}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <h3 className="font-heading font-semibold text-white mb-4">Новый промокод</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <input placeholder="KOD" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
              <option value="percentage">Процент (%)</option>
              <option value="fixed">Фиксированная</option>
            </select>
            <input type="number" placeholder="Значение" value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })} className="input-field" />
            <input type="number" placeholder="Мин. заказ" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: +e.target.value })} className="input-field" />
            <button onClick={handleCreate} className="btn-primary">Создать</button>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted border-b border-white/5 bg-primary/50">
              <th className="p-4 font-medium">Код</th>
              <th className="p-4 font-medium">Тип</th>
              <th className="p-4 font-medium">Значение</th>
              <th className="p-4 font-medium">Мин. заказ</th>
              <th className="p-4 font-medium">Использовано</th>
              <th className="p-4 font-medium">Статус</th>
              <th className="p-4 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-text-muted">Загрузка...</td></tr>
            ) : discounts.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-text-muted">Промокодов нет</td></tr>
            ) : discounts.map((d) => (
              <tr key={d.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-mono font-bold text-accent">{d.code}</td>
                <td className="p-4 text-white">{d.type === 'percentage' ? 'Процент' : 'Фикс.'}</td>
                <td className="p-4 text-white">{d.type === 'percentage' ? `${d.value}%` : formatPrice(d.value)}</td>
                <td className="p-4 text-text-muted">{d.minOrder > 0 ? formatPrice(d.minOrder) : '—'}</td>
                <td className="p-4 text-white">{d.usedCount} / {d.maxUses || '∞'}</td>
                <td className="p-4">
                  <span className={`badge ${d.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {d.isActive ? 'Активен' : 'Выключен'}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => toggleActive(d.id, d.isActive)} className="text-xs text-text-muted hover:text-white">
                    {d.isActive ? 'Выкл' : 'Вкл'}
                  </button>
                  <button onClick={() => deleteDiscount(d.id)} className="text-xs text-danger hover:text-red-300">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
