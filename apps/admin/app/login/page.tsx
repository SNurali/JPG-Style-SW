'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Force full reload to pick up fresh token
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-white">SmartWash Admin</h1>
          <p className="text-text-muted text-sm mt-1">Панель управления</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-button bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="admin@smartwash.uz" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Пароль</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className={`btn-primary w-full ${loading ? 'opacity-70' : ''}`}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className="text-xs text-text-muted text-center mt-6">
          По умолчанию: admin@smartwash.uz / admin123
        </p>
      </div>
    </div>
  );
}
