'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { useAdminApi } from '@/lib/auth';

export default function ReviewsPage() {
  const api = useAdminApi();
  const [reviews, setReviews] = useState<any[]>([]);
  const [showPending, setShowPending] = useState(true);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = showPending ? '?pending=true' : '';
      const res = await api(`/api/admin/reviews${qs}`);
      setReviews(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [api, showPending]);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    try {
      await api(`/api/admin/reviews/${id}/approve`, { method: 'PUT' });
      load();
    } catch (err) { console.error(err); }
  };

  const reject = async (id: string) => {
    try {
      await api(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      load();
    } catch (err) { console.error(err); }
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="section-title text-2xl">Отзывы</h1>
        <p className="text-text-muted text-sm mt-1">Модерация отзывов покупателей</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowPending(true)}
          className={`${showPending ? 'btn-primary' : 'btn-secondary'}`}
        >
          На модерации
        </button>
        <button
          onClick={() => setShowPending(false)}
          className={`${!showPending ? 'btn-primary' : 'btn-secondary'}`}
        >
          Все отзывы
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-text-muted">Загрузка...</p>
        ) : reviews.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted">{showPending ? 'Нет отзывов на модерации ✨' : 'Отзывов пока нет'}</p>
          </div>
        ) : reviews.map((review) => (
          <div key={review.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                    {review.customerName[0]}
                  </div>
                  <div>
                    <span className="text-white font-medium text-sm">{review.customerName}</span>
                    <span className="text-text-muted text-xs ml-2">{review.productName}</span>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={`text-sm ${s <= review.rating ? 'text-yellow-400' : 'text-white/10'}`}>★</span>
                  ))}
                </div>
                <p className="text-text-muted text-sm">{review.comment}</p>
                <p className="text-text-muted text-xs mt-2">{new Date(review.createdAt).toLocaleDateString('ru-RU')}</p>
              </div>

              {!review.isApproved && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => approve(review.id)} className="btn-primary text-xs">✓ Одобрить</button>
                  <button onClick={() => reject(review.id)} className="btn-danger text-xs">✕ Удалить</button>
                </div>
              )}
              {review.isApproved && (
                <span className="badge bg-green-500/20 text-green-400">Одобрен</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
