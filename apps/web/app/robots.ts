import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/checkout',
          '/account',
          '/cart',
          '/login',
          '/register',
          '/print-labels',
        ],
      },
    ],
    sitemap: 'https://smartwash.uz/sitemap.xml',
  };
}
