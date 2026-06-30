'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { GoogleButton } from '@/components/auth/GoogleButton';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.replace('/account'); }, [user, router]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone || undefined, password: form.password });
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally { setLoading(false); }
  };

  const onGoogle = async (idToken: string) => {
    setError(''); setLoading(true);
    try { await loginWithGoogle(idToken); router.push('/account'); }
    catch (err: any) { setError(err.message || 'Ошибка входа через Google'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="font-heading text-2xl font-bold text-white text-center mb-1">Регистрация</h1>
        <p className="text-text-muted text-sm text-center mb-6">Создайте аккаунт SmartWash</p>

        {error && <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Имя</label>
            <input type="text" required value={form.name} onChange={set('name')} className="input-field" placeholder="Ваше имя" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Email</label>
            <input type="email" required value={form.email} onChange={set('email')} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Телефон <span className="opacity-50">(необязательно)</span></label>
            <input type="tel" value={form.phone} onChange={set('phone')} className="input-field" placeholder="+998 __ ___ __ __" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Пароль</label>
            <input type="password" required minLength={6} value={form.password} onChange={set('password')} className="input-field" placeholder="минимум 6 символов" autoComplete="new-password" />
          </div>
          <button type="submit" disabled={loading} className={`btn-primary w-full ${loading ? 'opacity-70' : ''}`}>
            {loading ? 'Создаём...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-xs text-text-muted">или</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <GoogleButton onCredential={onGoogle} onError={setError} />

        <p className="text-sm text-text-muted text-center mt-6">
          Уже есть аккаунт? <Link href="/login" className="text-accent hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}
