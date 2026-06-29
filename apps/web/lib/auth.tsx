'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginCustomer, registerCustomer, googleLoginCustomer } from '@/lib/api';

export interface CustomerUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  googleLinked?: boolean;
  hasPassword?: boolean;
}

interface AuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  setUser: (u: CustomerUser) => void;
}

const TOKEN_KEY = 'sw-customer-token';
const USER_KEY = 'sw-customer-user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return !!payload.exp && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t && u && !isExpired(t)) {
      setToken(t);
      try { setUserState(JSON.parse(u)); } catch {}
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((t: string, u: CustomerUser) => {
    setToken(t);
    setUserState(u);
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await loginCustomer({ email, password });
    persist(data.token, data.user);
  }, [persist]);

  const register = useCallback(async (d: { name: string; email: string; phone?: string; password: string }) => {
    const { data } = await registerCustomer(d);
    persist(data.token, data.user);
  }, [persist]);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const { data } = await googleLoginCustomer(idToken);
    persist(data.token, data.user);
  }, [persist]);

  const logout = useCallback(() => {
    setToken(null);
    setUserState(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const setUser = useCallback((u: CustomerUser) => {
    setUserState(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, loginWithGoogle, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
