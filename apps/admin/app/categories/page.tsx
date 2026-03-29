'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { useAdminApi, useAuth } from '@/lib/auth';

export default function CategoriesPage() {
  const api = useAdminApi();
  const { token } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCat, setEditCat] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const emptyForm = { name: '', slug: '', description: '', image: '', sortOrder: 0 };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api('/api/admin/categories');
      setCategories(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const handleEdit = (cat: any) => {
    setEditCat(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image || '', sortOrder: cat.sortOrder });
    setShowCreate(false);
  };

  const handleCreate = () => {
    setEditCat(null);
    setForm(emptyForm);
    setShowCreate(true);
  };

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('http://localhost:4001/api/upload/category', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
      });
      const data = await res.json();
      if (data.data?.url) setForm(prev => ({ ...prev, image: data.data.url }));
    } catch (err) { console.error(err); }
    finally { setUploadingImage(false); e.target.value = ''; }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editCat) {
        await api(`/api/admin/categories/${editCat.id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await api('/api/admin/categories', { method: 'POST', body: JSON.stringify(form) });
      }
      setEditCat(null); setShowCreate(false); setForm(emptyForm);
      load();
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const isEditing = editCat || showCreate;

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title text-2xl">Категории</h1>
          <p className="text-text-muted text-sm mt-1">Управление категориями каталога</p>
        </div>
        <button onClick={handleCreate} className="btn-primary">+ Добавить категорию</button>
      </div>

      {isEditing && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-white">{editCat ? `Редактировать: ${editCat.name}` : 'Новая категория'}</h2>
            <button onClick={() => { setEditCat(null); setShowCreate(false); }} className="btn-icon text-lg">✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Название *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })}
                className="input-field" placeholder="Автошампуни" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Порядок сортировки</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: +e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Изображение</label>
              <div className="flex items-center gap-3">
                {form.image && <img src={`http://localhost:4001${form.image}`} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                <label className={`btn-secondary text-xs cursor-pointer ${uploadingImage ? 'opacity-50' : ''}`}>
                  {uploadingImage ? '⏳ Загрузка...' : '📷 Загрузить'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} disabled={uploadingImage} />
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-text-muted mb-1">Описание</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field min-h-[80px] resize-none" placeholder="Описание категории..." />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className={`btn-primary ${saving ? 'opacity-70' : ''}`}>
              {saving ? '⏳' : editCat ? '💾 Сохранить' : '➕ Создать'}
            </button>
            <button onClick={() => { setEditCat(null); setShowCreate(false); }} className="btn-secondary">Отмена</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-text-muted col-span-3 text-center py-8">Загрузка...</p>
        ) : categories.map((cat) => (
          <div key={cat.id} className="glass-card p-5 hover:border-accent/30 transition-colors cursor-pointer" onClick={() => handleEdit(cat)}>
            <div className="flex items-start justify-between mb-3">
              {cat.image ? (
                <img src={`http://localhost:4001${cat.image}`} alt="" className="w-14 h-14 rounded-lg object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-primary-light flex items-center justify-center text-2xl">📁</div>
              )}
              <span className={`badge ${cat.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {cat.isActive ? 'Активна' : 'Скрыта'}
              </span>
            </div>
            <h3 className="text-white font-medium mb-1">{cat.name}</h3>
            <p className="text-text-muted text-xs mb-2 line-clamp-2">{cat.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-accent">{cat.productCount} товаров</span>
              <span className="text-text-muted">Порядок: {cat.sortOrder}</span>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
