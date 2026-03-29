'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { useAdminApi } from '@/lib/auth';

function formatPrice(price: number) {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' сўм';
}

export default function CustomersPage() {
  const api = useAdminApi();
  const [customers, setCustomers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) qs.set('search', search);
      const res = await api(`/api/admin/customers?${qs}`);
      setCustomers(res.data || []);
      setPagination(res.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [api, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="section-title text-2xl">Клиенты</h1>
        <p className="text-text-muted text-sm mt-1">База покупателей</p>
      </div>

      <div className="mb-6">
        <input
          type="search" placeholder="Поиск по имени или телефону..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(1)}
          className="input-field max-w-md"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted border-b border-white/5 bg-primary/50">
              <th className="p-4 font-medium">Клиент</th>
              <th className="p-4 font-medium">Телефон</th>
              <th className="p-4 font-medium">Заказов</th>
              <th className="p-4 font-medium">Потрачено</th>
              <th className="p-4 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-text-muted">Загрузка...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-text-muted">Клиенты не найдены</td></tr>
            ) : customers.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                      {c.firstName?.[0] || '?'}
                    </div>
                    <div className="text-white font-medium">{c.firstName} {c.lastName}</div>
                  </div>
                </td>
                <td className="p-4 text-text-muted">{c.phone}</td>
                <td className="p-4 text-white">{c.orderCount}</td>
                <td className="p-4 text-white">{formatPrice(c.totalSpent)}</td>
                <td className="p-4 text-text-muted">{new Date(c.createdAt).toLocaleDateString('ru-RU')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5">
            <span className="text-xs text-text-muted">Страница {pagination.page} из {pagination.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)} className="btn-secondary text-xs disabled:opacity-30">←</button>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => load(pagination.page + 1)} className="btn-secondary text-xs disabled:opacity-30">→</button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
