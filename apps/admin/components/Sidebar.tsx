'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navItems = [
  { href: '/', label: 'Дашборд', icon: '📊' },
  { href: '/products', label: 'Товары', icon: '📦' },
  { href: '/categories', label: 'Категории', icon: '📁' },
  { href: '/orders', label: 'Заказы', icon: '🛒' },
  { href: '/customers', label: 'Клиенты', icon: '👥' },
  { href: '/reviews', label: 'Отзывы', icon: '⭐' },
  { href: '/discounts', label: 'Скидки', icon: '🏷️' },
  { href: '/analytics', label: 'Аналитика', icon: '📈' },
  { href: '/settings', label: 'Настройки', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-primary border-r border-white/5 transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-60'} flex flex-col`}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="font-heading font-bold text-white text-sm">Admin</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="btn-icon text-sm">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-button text-sm transition-all ${
                isActive
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="btn-icon text-sm flex-shrink-0" title="Выйти">🚪</button>
          </div>
        ) : (
          <button onClick={logout} className="btn-icon w-full text-sm" title="Выйти">🚪</button>
        )}
      </div>
    </aside>
  );
}
