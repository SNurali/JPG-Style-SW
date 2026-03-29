import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatBot } from '@/components/chat/ChatBot';
import { CartProvider } from '@/lib/cart-context';
import { LanguageProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'JPG Style SmartWash — Premium Auto Care Products',
  description:
    'Professional automotive detailing products. Auto shampoo, nano coatings, wax, tire care, and accessories. Premium quality for car enthusiasts.',
  keywords: 'auto detailing, car care, auto shampoo, nano coating, wax, car wash, Tashkent',
  manifest: '/manifest.json',
  themeColor: '#0f0f23',
  openGraph: {
    title: 'JPG Style SmartWash — Premium Auto Care Products',
    description: 'Professional automotive detailing products for car enthusiasts.',
    type: 'website',
    locale: 'ru_RU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className="bg-surface text-text-main min-h-screen flex flex-col">
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatBot />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
