'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { useAdminApi } from '@/lib/auth';

function formatPrice(price: number) {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' сўм';
}

const statusOptions = [
  { value: '', label: 'Все статусы' },
  { value: 'pending', label: 'Ожидает' },
  { value: 'confirmed', label: 'Подтверждён' },
  { value: 'processing', label: 'В обработке' },
  { value: 'delivering', label: 'Доставляется' },
  { value: 'delivered', label: 'Доставлен' },
  { value: 'cancelled', label: 'Отменён' },
];

const statusLabels: Record<string, string> = {
  pending: 'Ожидает', confirmed: 'Подтверждён', processing: 'В обработке',
  delivering: 'Доставляется', delivered: 'Доставлен', cancelled: 'Отменён',
};

const paymentLabels: Record<string, string> = {
  pending: 'Ожидает', awaiting: 'Ожидает оплаты', paid: 'Оплачено', failed: 'Ошибка',
};

export default function OrdersPage() {
  const api = useAdminApi();
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const loadOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) qs.set('search', search);
      if (statusFilter) qs.set('status', statusFilter);
      const res = await api(`/api/admin/orders?${qs}`);
      setOrders(res.data || []);
      setPagination(res.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [api, search, statusFilter]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      loadOrders(pagination.page);
    } catch (err) { console.error(err); }
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="section-title text-2xl">Заказы</h1>
        <p className="text-text-muted text-sm mt-1">Управление заказами и статусами</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          placeholder="Поиск по номеру, телефону..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && loadOrders(1)}
          className="input-field max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); }}
          className="input-field max-w-[200px]"
        >
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button onClick={() => loadOrders(1)} className="btn-secondary">Фильтр</button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-white/5 bg-primary/50">
                <th className="p-4 font-medium">Заказ</th>
                <th className="p-4 font-medium">Клиент</th>
                <th className="p-4 font-medium">Сумма</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium">Оплата</th>
                <th className="p-4 font-medium">Дата</th>
                <th className="p-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-text-muted">Загрузка...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-text-muted">Заказов не найдено</td></tr>
              ) : orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    className="hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <td className="p-4 font-medium text-accent">{order.orderNumber}</td>
                    <td className="p-4">
                      <div className="text-white">{order.customerName}</div>
                      <div className="text-text-muted text-xs">{order.customerPhone}</div>
                    </td>
                    <td className="p-4 text-white font-medium">{formatPrice(order.total)}</td>
                    <td className="p-4"><span className={`badge-${order.status}`}>{statusLabels[order.status]}</span></td>
                    <td className="p-4"><span className={`badge-${order.paymentStatus}`}>{paymentLabels[order.paymentStatus]}</span></td>
                    <td className="p-4 text-text-muted">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className="input-field text-xs py-1 px-2 w-auto"
                      >
                        {statusOptions.filter((o) => o.value).map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {/* Expanded row */}
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={7} className="p-4 bg-primary/30">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-text-muted mb-1">Товары:</p>
                            {(order.items || []).map((item: any, i: number) => (
                              <p key={i} className="text-white">
                                {item.productName} × {item.quantity} = {formatPrice(item.totalPrice)}
                              </p>
                            ))}
                          </div>
                          <div>
                            <p className="text-text-muted">Адрес: <span className="text-white">{order.deliveryAddress || 'Самовывоз'}</span></p>
                            <p className="text-text-muted">Зона: <span className="text-white">{order.deliveryZone}</span></p>
                            <p className="text-text-muted">Оплата: <span className="text-white">{order.paymentMethod}</span></p>
                            {order.notes && <p className="text-text-muted">Комментарий: <span className="text-white">{order.notes}</span></p>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5">
            <span className="text-xs text-text-muted">Страница {pagination.page} из {pagination.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => loadOrders(pagination.page - 1)} className="btn-secondary text-xs disabled:opacity-30">←</button>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadOrders(pagination.page + 1)} className="btn-secondary text-xs disabled:opacity-30">→</button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
