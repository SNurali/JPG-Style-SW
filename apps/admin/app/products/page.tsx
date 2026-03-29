'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { useAdminApi, useAuth } from '@/lib/auth';

function formatPrice(price: number) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сўм';
}

export default function ProductsPage() {
  const api = useAdminApi();
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const emptyForm = {
    name: '', slug: '', description: '', price: 0, compareAtPrice: 0,
    sku: '', categoryId: '', isBestseller: false, isNew: false, stock: 0, images: [] as string[],
  };
  const [form, setForm] = useState(emptyForm);

  const loadProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) qs.set('search', search);
      const res = await api(`/api/admin/products?${qs}`);
      setProducts(res.data || []);
      setPagination(res.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [api, search]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await api('/api/admin/categories');
      setCategories(res.data || []);
    } catch (err) { console.error(err); }
  }, [api]);

  useEffect(() => { loadProducts(); loadCategories(); }, [loadProducts, loadCategories]);

  const handleEdit = (product: any) => {
    setEditProduct(product);
    setForm({
      name: product.name, slug: product.slug, description: product.description,
      price: product.price, compareAtPrice: product.compareAtPrice || 0,
      sku: product.sku, categoryId: product.categoryId,
      isBestseller: product.isBestseller, isNew: product.isNew,
      stock: product.stock, images: product.images || [],
    });
    setShowCreate(false);
  };

  const handleCreate = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setShowCreate(true);
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('http://localhost:4001/api/upload/product', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.data?.url) {
        setForm(prev => ({ ...prev, images: [...prev.images, data.data.url] }));
      }
    } catch (err) { console.error('Upload error:', err); }
    finally { setUploadingImage(false); e.target.value = ''; }
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editProduct) {
        await api(`/api/admin/products/${editProduct.id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await api('/api/admin/products', { method: 'POST', body: JSON.stringify(form) });
      }
      setEditProduct(null);
      setShowCreate(false);
      setForm(emptyForm);
      loadProducts(pagination.page);
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await api(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify({ isActive: !isActive }) });
    loadProducts(pagination.page);
  };

  const isEditing = editProduct || showCreate;

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title text-2xl">Товары</h1>
          <p className="text-text-muted text-sm mt-1">Управление каталогом продукции</p>
        </div>
        <button onClick={handleCreate} className="btn-primary">+ Добавить товар</button>
      </div>

      {/* Edit/Create Form */}
      {isEditing && (
        <div className="glass-card p-6 mb-6 animate-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-white text-lg">
              {editProduct ? `Редактировать: ${editProduct.name}` : 'Новый товар'}
            </h2>
            <button onClick={() => { setEditProduct(null); setShowCreate(false); }} className="btn-icon text-lg">✕</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Название *</label>
              <input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) }); }}
                className="input-field" placeholder="SmartWash Auto Shampoo 1L" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Slug (URL)</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="input-field" placeholder="smartwash-auto-shampoo-1l" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">SKU *</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="input-field" placeholder="SW-SH-001" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Категория *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="input-field">
                <option value="">Выберите категорию</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Цена (сўм) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Старая цена (сўм)</label>
              <input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: +e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Остаток на складе</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })}
                className="input-field" />
            </div>
            <div className="flex items-end gap-4 pb-1">
              <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                <input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
                  className="accent-accent w-4 h-4" />
                🔥 Хит продаж
              </label>
              <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                  className="accent-accent w-4 h-4" />
                ✨ Новинка
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-text-muted mb-1">Описание</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field min-h-[100px] resize-none" placeholder="Описание товара..." />
          </div>

          {/* Images */}
          <div className="mb-4">
            <label className="block text-sm text-text-muted mb-2">Фотографии</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10 group">
                  <img src={`http://localhost:4001${img}`} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-danger text-xl transition-opacity"
                  >✕</button>
                </div>
              ))}
              <label className={`w-24 h-24 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors ${uploadingImage ? 'opacity-50' : ''}`}>
                <span className="text-2xl text-text-muted">{uploadingImage ? '⏳' : '+'}</span>
                <span className="text-[10px] text-text-muted">{uploadingImage ? 'Загрузка...' : 'Добавить'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} disabled={uploadingImage} />
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className={`btn-primary ${saving ? 'opacity-70' : ''}`}>
              {saving ? '⏳ Сохраняем...' : editProduct ? '💾 Сохранить' : '➕ Создать'}
            </button>
            <button onClick={() => { setEditProduct(null); setShowCreate(false); }} className="btn-secondary">Отмена</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input type="search" placeholder="Поиск по названию или SKU..." value={search}
          onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadProducts(1)}
          className="input-field max-w-md" />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-white/5 bg-primary/50">
                <th className="p-4 font-medium">Фото</th>
                <th className="p-4 font-medium">Товар</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Цена</th>
                <th className="p-4 font-medium">Остаток</th>
                <th className="p-4 font-medium">Рейтинг</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-text-muted animate-pulse">Загрузка...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-text-muted">Товары не найдены</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="p-4">
                    {p.images?.[0] ? (
                      <img src={`http://localhost:4001${p.images[0]}`} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-lg">📦</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{p.name}</div>
                    <div className="text-text-muted text-xs">{p.categoryName}</div>
                  </td>
                  <td className="p-4 text-text-muted font-mono text-xs">{p.sku}</td>
                  <td className="p-4">
                    <div className="text-white">{formatPrice(p.price)}</div>
                    {p.compareAtPrice > 0 && <div className="text-text-muted text-xs line-through">{formatPrice(p.compareAtPrice)}</div>}
                  </td>
                  <td className="p-4">
                    <span className={p.stock === 0 ? 'text-danger font-bold' : p.stock <= 5 ? 'text-orange-400' : 'text-white'}>
                      {p.stock} шт
                    </span>
                  </td>
                  <td className="p-4 text-white">⭐ {p.rating} <span className="text-text-muted text-xs">({p.reviewCount})</span></td>
                  <td className="p-4">
                    <span className={`badge ${p.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {p.isActive ? 'Активен' : 'Скрыт'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-xs text-accent hover:text-white transition-colors">✏️ Ред.</button>
                      <button onClick={() => toggleActive(p.id, p.isActive)}
                        className={`text-xs transition-colors ${p.isActive ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}`}>
                        {p.isActive ? '👁‍🗨 Скрыть' : '👁 Показать'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5">
            <span className="text-xs text-text-muted">Стр. {pagination.page} из {pagination.totalPages} ({pagination.total} товаров)</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => loadProducts(pagination.page - 1)} className="btn-secondary text-xs disabled:opacity-30">← Назад</button>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadProducts(pagination.page + 1)} className="btn-secondary text-xs disabled:opacity-30">Далее →</button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
