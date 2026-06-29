'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { GoogleButton } from '@/components/auth/GoogleButton';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.replace('/account'); }, [user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
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
        <h1 className="font-heading text-2xl font-bold text-white text-center mb-1">Вход</h1>
        <p className="text-text-muted text-sm text-center mb-6">Войдите в личный кабинет SmartWash</p>

        {error && <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Пароль</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className={`btn-primary w-full ${loading ? 'opacity-70' : ''}`}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-xs text-text-muted">или</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <GoogleButton onCredential={onGoogle} onError={setError} />

        <p className="text-sm text-text-muted text-center mt-6">
          Нет аккаунта? <Link href="/register" className="text-accent hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
