import type { MetadataRoute } from 'next';

const DISALLOW = [
  '/api/',
  '/admin/',
  '/checkout',
  '/account',
  '/cart',
  '/login',
  '/register',
  '/print-labels',
];

// AI crawlers/answer-engine bots we explicitly want indexing the catalog for AEO/GEO
// (ChatGPT/Perplexity/Google AI Overviews/Gemini/Claude citations, etc.)
const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
  'Bytespider',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
      })),
    ],
    sitemap: 'https://smartwash.uz/sitemap.xml',
  };
}
