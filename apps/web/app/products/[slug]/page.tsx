import type { Metadata } from 'next';
import Link from 'next/link';
import { products, getProductBySlug } from '@/lib/data';
import { productJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { ProductPageClient } from './ProductPageClient';

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Товар не найден' };

  const priceStr = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const title = `${product.name} — купить за ${priceStr} сўм`;
  const description = `${product.description} ✓ В наличии ${product.stock} шт. ✓ Рейтинг ${product.rating}/5 (${product.reviewCount} отзывов). Доставка по Ташкенту в день заказа.`;

  return {
    title,
    description,
    keywords: `${product.name}, ${product.category}, купить ${product.category.toLowerCase()}, SmartWash, Ташкент, ${product.sku}`,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: product.image, width: 600, height: 600, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://smartwash.uz/products/${product.slug}`,
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="section-title mb-4">Товар не найден</h1>
        <Link href="/categories" className="btn-primary">Перейти в каталог</Link>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Главная', url: 'https://smartwash.uz' },
    { name: 'Каталог', url: 'https://smartwash.uz/categories' },
    { name: product.category, url: `https://smartwash.uz/categories/${product.categorySlug}` },
    { name: product.name, url: `https://smartwash.uz/products/${product.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
