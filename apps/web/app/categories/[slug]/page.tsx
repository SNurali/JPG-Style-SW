import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, getProductsByCategory, getCategoryBySlug } from '@/lib/data';
import { categoryJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { pluralizeRu } from '@/lib/pluralize';
import { CategoryPageClient } from './CategoryPageClient';

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) return { title: 'Категория не найдена' };

  const count = getProductsByCategory(params.slug).length;
  const title = `${category.name} — купить профессиональную автохимию в Ташкенте`;
  const description = `${category.description}. ${count} ${pluralizeRu(count, ['товар', 'товара', 'товаров'])} в наличии. ✓ Доставка в день заказа ✓ Оптом и в розницу. JPG Style SmartWash.`;

  return {
    title,
    description,
    keywords: `${category.name}, купить ${category.name.toLowerCase()}, автохимия Ташкент, SmartWash, профессиональная автохимия`,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: category.image, width: 400, height: 300, alt: category.name }],
    },
    alternates: {
      canonical: `https://smartwash.uz/categories/${category.slug}`,
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  const categoryProducts = getProductsByCategory(params.slug);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="section-title mb-4">Категория не найдена</h1>
        <Link href="/categories" className="btn-primary">
          Все категории
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Главная', url: 'https://smartwash.uz' },
    { name: 'Каталог', url: 'https://smartwash.uz/categories' },
    { name: category.name, url: `https://smartwash.uz/categories/${category.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryJsonLd(category, categoryProducts.length)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <CategoryPageClient category={category} categoryProducts={categoryProducts} />
    </>
  );
}
