import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatBot } from '@/components/chat/ChatBot';
import { CartProvider } from '@/lib/cart-context';
import { LanguageProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth';
import { organizationJsonLd, localBusinessJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://smartwash.uz'),
  title: {
    default: 'JPG Style SmartWash — Профессиональная автохимия премиум-класса | Ташкент',
    template: '%s | JPG Style SmartWash',
  },
  description:
    'Купить профессиональную автохимию в Ташкенте: автошампуни, активная пена, нано-покрытия, воски, чернители шин. Доставка в день заказа. ☎ +998 99 030 99 86',
  keywords:
    'автохимия Ташкент, автошампунь, активная пена, нано покрытие, воск для авто, чернитель шин, детейлинг, SmartWash, профессиональная автохимия, купить автохимию Узбекистан',
  manifest: '/manifest.json',
  themeColor: '#0f0f23',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'JPG Style SmartWash — Профессиональная автохимия премиум-класса',
    description:
      'Купить профессиональную автохимию в Ташкенте: автошампуни, нано-покрытия, воски, чернители. Доставка в день заказа.',
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: ['uz_UZ', 'en_US'],
    url: 'https://smartwash.uz',
    siteName: 'JPG Style SmartWash',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JPG Style SmartWash — Профессиональная автохимия премиум-класса в Ташкенте',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG Style SmartWash — Профессиональная автохимия',
    description:
      'Автошампуни, нано-покрытия, воски, чернители. Доставка по Ташкенту в день заказа.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://smartwash.uz',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </head>
      <body className="bg-surface text-text-main min-h-screen flex flex-col">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <ChatBot />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
