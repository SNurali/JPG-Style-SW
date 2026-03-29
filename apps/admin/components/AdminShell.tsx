'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import LoginPage from '@/app/login/page';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted text-lg animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        {children}
      </main>
    </div>
  );
}
