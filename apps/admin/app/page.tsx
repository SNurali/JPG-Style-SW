'use client';

import React, { useEffect, useState } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { useAdminApi } from '@/lib/auth';

interface DashboardData {
  ordersToday: number;
  revenueToday: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  pendingReviews: number;
  recentOrders: any[];
}

function formatPrice(price: number) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сўм';
}

export default function DashboardPage() {
  const api = useAdminApi();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/admin/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => console.log('Dashboard load:', err.message))
      .finally(() => setLoading(false));
  }, [api]);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="section-title text-2xl">Дашборд</h1>
        <p className="text-text-muted text-sm mt-1">Обзор вашего магазина</p>
      </div>

      {loading ? (
        <div className="text-text-muted animate-pulse">Загрузка данных...</div>
      ) : data ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Заказы сегодня" value={String(data.ordersToday)} icon="📋" />
            <StatCard label="Выручка сегодня" value={formatPrice(data.revenueToday)} icon="💰" />
            <StatCard label="Всего заказов" value={String(data.totalOrders)} icon="📦" />
            <StatCard label="Всего клиентов" value={String(data.totalCustomers)} icon="👥" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Общая выручка" value={formatPrice(data.totalRevenue)} icon="📊" accent />
            <StatCard label="Активных товаров" value={String(data.totalProducts)} icon="🛍️" />
            <StatCard label="Ожидают обработки" value={String(data.pendingOrders)} icon="⏳" warning={data.pendingOrders > 0} />
            <StatCard label="Ожидают модерации" value={String(data.pendingReviews)} icon="⭐" warning={data.pendingReviews > 0} />
          </div>

          {/* Recent orders */}
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold text-white mb-4">Последние заказы</h2>
            {data.recentOrders.length === 0 ? (
              <p className="text-text-muted text-sm">Заказов пока нет</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-text-muted border-b border-white/5">
                      <th className="pb-3 font-medium">Заказ</th>
                      <th className="pb-3 font-medium">Клиент</th>
                      <th className="pb-3 font-medium">Сумма</th>
                      <th className="pb-3 font-medium">Статус</th>
                      <th className="pb-3 font-medium">Оплата</th>
                      <th className="pb-3 font-medium">Дата</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/2">
                        <td className="py-3 font-medium text-accent">{order.orderNumber}</td>
                        <td className="py-3">
                          <div className="text-white">{order.customerName}</div>
                          <div className="text-text-muted text-xs">{order.customerPhone}</div>
                        </td>
                        <td className="py-3 text-white">{formatPrice(order.total)}</td>
                        <td className="py-3"><StatusBadge status={order.status} /></td>
                        <td className="py-3"><StatusBadge status={order.paymentStatus} /></td>
                        <td className="py-3 text-text-muted">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-text-muted">Ошибка загрузки данных</p>
      )}
    </AdminShell>
  );
}

function StatCard({ label, value, icon, accent, warning }: {
  label: string; value: string; icon: string; accent?: boolean; warning?: boolean;
}) {
  return (
    <div className={`glass-card p-5 ${warning ? 'border-orange-500/30' : accent ? 'border-accent/30' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`font-heading font-bold text-lg ${accent ? 'text-accent' : warning ? 'text-orange-400' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-text-muted mt-1">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    pending: 'Ожидает', confirmed: 'Подтверждён', processing: 'В обработке',
    delivering: 'Доставляется', delivered: 'Доставлен', cancelled: 'Отменён',
    awaiting: 'Ожидает оплаты', paid: 'Оплачено', failed: 'Ошибка',
  };
  return <span className={`badge-${status}`}>{labels[status] || status}</span>;
}
