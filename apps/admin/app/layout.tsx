import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'SmartWash Admin — Dashboard',
  description: 'Admin panel for JPG Style SmartWash',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className="bg-surface text-text-main min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
