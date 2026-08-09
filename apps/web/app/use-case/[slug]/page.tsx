import type { Metadata } from 'next';
import Link from 'next/link';
import { useCases, getUseCaseBySlug } from '@/lib/use-case-data';
import { products, getProductBySlug } from '@/lib/data';
import { useCaseJsonLd, useCaseFaqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { UseCasePageClient } from './UseCasePageClient';

export async function generateStaticParams() {
  return useCases.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const useCase = getUseCaseBySlug(params.slug);
  if (!useCase) return { title: 'Страница не найдена' };

  return {
    title: useCase.metaTitle,
    description: useCase.metaDescription,
    keywords: useCase.keywords,
    openGraph: {
      title: useCase.metaTitle,
      description: useCase.metaDescription,
      type: 'website',
      url: `https://smartwash.uz/use-case/${useCase.slug}`,
    },
    alternates: {
      canonical: `https://smartwash.uz/use-case/${useCase.slug}`,
    },
  };
}

export default function UseCasePage({ params }: { params: { slug: string } }) {
  const useCase = getUseCaseBySlug(params.slug);

  if (!useCase) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="section-title mb-4">Страница не найдена</h1>
        <Link href="/categories" className="btn-primary">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  const useCaseProducts = useCase.productSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const breadcrumbs = [
    { name: 'Главная', url: 'https://smartwash.uz' },
    { name: 'Применение', url: 'https://smartwash.uz/use-case' },
    { name: useCase.title, url: `https://smartwash.uz/use-case/${useCase.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(useCaseJsonLd(useCase, useCaseProducts.length)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(useCaseFaqJsonLd(useCase)) }}
      />
      <UseCasePageClient useCase={useCase} products={useCaseProducts} />
    </>
  );
}
