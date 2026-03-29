'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/AdminShell';
import { useAdminApi, useAuth } from '@/lib/auth';

export default function SettingsPage() {
  const { user } = useAuth();
  const api = useAdminApi();
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [msg, setMsg] = useState('');

  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) return setMsg('❌ Пароли не совпадают');
    if (passwords.newPass.length < 6) return setMsg('❌ Минимум 6 символов');
    setChangingPassword(true);
    setMsg('');
    try {
      await api('/api/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      setMsg('✅ Пароль успешно изменён');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err: any) { setMsg(`❌ ${err.message}`); }
    finally { setChangingPassword(false); }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="section-title text-2xl">Настройки</h1>
        <p className="text-text-muted text-sm mt-1">Управление аккаунтом и параметрами</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Account info */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold text-white mb-4">👤 Аккаунт</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-muted text-sm">Имя</span>
              <span className="text-white text-sm font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted text-sm">Email</span>
              <span className="text-white text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted text-sm">Роль</span>
              <span className="badge bg-accent/20 text-accent">{user?.role === 'superadmin' ? 'Суперадмин' : 'Админ'}</span>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold text-white mb-4">🔐 Сменить пароль</h2>
          <div className="space-y-3">
            <input type="password" placeholder="Текущий пароль" value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="input-field" />
            <input type="password" placeholder="Новый пароль" value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} className="input-field" />
            <input type="password" placeholder="Подтвердите пароль" value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="input-field" />
            {msg && <p className={`text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-danger'}`}>{msg}</p>}
            <button onClick={handleChangePassword} disabled={changingPassword}
              className={`btn-primary ${changingPassword ? 'opacity-70' : ''}`}>
              {changingPassword ? '⏳ Сменяем...' : 'Сменить пароль'}
            </button>
          </div>
        </div>

        {/* Contact info */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold text-white mb-4">📱 Контактная информация магазина</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Telegram</span>
              <a href="https://t.me/JPGSTYLE_SMARTWASH" target="_blank" className="text-accent hover:underline">@JPGSTYLE_SMARTWASH</a>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Телефон 1</span>
              <span className="text-white">+998 99 030 99 86</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Телефон 2</span>
              <span className="text-white">+998 50 104 00 26</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Адрес</span>
              <span className="text-white">Ташкент, Узбекистан</span>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold text-white mb-4">🔗 Интеграции</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Telegram Bot</p>
                <p className="text-text-muted text-xs">Уведомления о новых заказах</p>
              </div>
              <span className="badge bg-green-500/20 text-green-400">Активен</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Click Оплата</p>
                <p className="text-text-muted text-xs">Онлайн оплата через Click</p>
              </div>
              <span className="badge bg-yellow-500/20 text-yellow-400">Скоро</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Payme</p>
                <p className="text-text-muted text-xs">Онлайн оплата через Payme</p>
              </div>
              <span className="badge bg-yellow-500/20 text-yellow-400">Скоро</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
