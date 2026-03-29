'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminUser { id: string; email: string; name: string; role: string; }
interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin-token');
    const savedUser = localStorage.getItem('admin-user');
    if (savedToken && savedUser) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          // Token expired — clear everything
          localStorage.removeItem('admin-token');
          localStorage.removeItem('admin-user');
          setUser(null);
          setToken(null);
        } else {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch {
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-user');
        setUser(null);
        setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Ошибка сервера' }));
      throw new Error(err.error || 'Login failed');
    }
    const { data } = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('admin-token', data.token);
    localStorage.setItem('admin-user', JSON.stringify(data.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Authenticated API fetch — reads token directly from localStorage for reliability */
export function useAdminApi() {
  const api = useCallback(async (path: string, options?: RequestInit) => {
    const currentToken = localStorage.getItem('admin-token');
    if (!currentToken) {
      return { data: null };
    }
    // Check if token is expired before making request
    try {
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-user');
        return { data: null };
      }
    } catch {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-user');
      return { data: null };
    }

    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  }, []);

  return api;
}
