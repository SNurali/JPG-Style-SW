'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { useAdminApi } from '@/lib/auth';

function formatPrice(price: number) {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' сўм';
}

export default function AnalyticsPage() {
  const api = useAdminApi();
  const [data, setData] = useState<any>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api(`/api/admin/analytics?days=${days}`);
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [api, days]);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title text-2xl">Аналитика</h1>
          <p className="text-text-muted text-sm mt-1">Статистика продаж</p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`${days === d ? 'btn-primary' : 'btn-secondary'} text-xs`}
            >
              {d}д
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-text-muted">Загрузка...</p>
      ) : data ? (
        <div className="space-y-6">
          {/* Daily Revenue Bar Chart (simple) */}
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold text-white mb-4">Выручка по дням</h2>
            {data.dailyRevenue.length === 0 ? (
              <p className="text-text-muted text-sm">Нет данных за выбранный период</p>
            ) : (
              <div className="flex items-end gap-1 h-40">
                {data.dailyRevenue.map((day: any, i: number) => {
                  const maxRev = Math.max(...data.dailyRevenue.map((d: any) => parseInt(d.revenue)));
                  const height = maxRev > 0 ? (parseInt(day.revenue) / maxRev) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group" title={`${day.date}: ${formatPrice(parseInt(day.revenue))} (${day.orders} заказов)`}>
                      <div
                        className="w-full bg-accent/60 rounded-t group-hover:bg-accent transition-colors"
                        style={{ height: `${Math.max(4, height)}%` }}
                      />
                      <span className="text-[8px] text-text-muted">{new Date(day.date).getDate()}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="glass-card p-6">
              <h2 className="font-heading font-semibold text-white mb-4">Топ товары</h2>
              {data.topProducts.length === 0 ? (
                <p className="text-text-muted text-sm">Нет данных</p>
              ) : (
                <div className="space-y-3">
                  {data.topProducts.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted text-xs w-5">{i + 1}.</span>
                        <span className="text-white text-sm">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm font-medium">{formatPrice(parseInt(item.total_revenue))}</div>
                        <div className="text-text-muted text-xs">{item.total_sold} шт</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Distribution */}
            <div className="glass-card p-6">
              <h2 className="font-heading font-semibold text-white mb-4">Статусы заказов</h2>
              {data.statusDistribution.length === 0 ? (
                <p className="text-text-muted text-sm">Нет данных</p>
              ) : (
                <div className="space-y-3">
                  {data.statusDistribution.map((item: any, i: number) => {
                    const labels: Record<string, string> = {
                      pending: '⏳ Ожидает', confirmed: '✅ Подтверждён', processing: '📦 В обработке',
                      delivering: '🚚 Доставляется', delivered: '🎉 Доставлен', cancelled: '❌ Отменён',
                    };
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-white text-sm">{labels[item.status] || item.status}</span>
                        <span className="text-text-muted text-sm font-mono">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-text-muted">Ошибка загрузки данных</p>
      )}
    </AdminShell>
  );
}
