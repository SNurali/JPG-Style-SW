import type { Product, Category } from './data';

const BASE_URL = 'https://smartwash.uz';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JPG Style SmartWash',
    url: BASE_URL,
    logo: `${BASE_URL}/icon-512.png`,
    description:
      'Профессиональная автохимия премиум-класса. Автошампуни, нано-покрытия, воски, чернители.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ташкент',
      addressCountry: 'UZ',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+998-99-030-9986',
        contactType: 'customer service',
        availableLanguage: ['Russian', 'Uzbek'],
      },
    ],
    sameAs: ['https://t.me/JPGSTYLE_SMARTWASH'],
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'JPG Style SmartWash',
    image: `${BASE_URL}/icon-512.png`,
    url: BASE_URL,
    telephone: '+998-99-030-9986',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ташкент',
      addressCountry: 'UZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.2995,
      longitude: 69.2401,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '17:00',
      },
    ],
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '182',
    },
  };
}

export function productJsonLd(product: Product) {
  const additionalProperty: Array<{ '@type': string; name: string; value: string }> = [];
  if (product.volume) {
    additionalProperty.push({ '@type': 'PropertyValue', name: 'Объём/вес', value: product.volume });
  }
  if (product.dilutionRatio) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Разведение с водой',
      value: product.dilutionRatio,
    });
  }
  if (product.bestFor) {
    additionalProperty.push({ '@type': 'PropertyValue', name: 'Для кого/чего', value: product.bestFor });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `${BASE_URL}${product.image}`,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'SmartWash',
    },
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: 'UZS',
      price: product.price,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'JPG Style SmartWash',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      bestRating: '5',
    },
  };
}

export function productFaqJsonLd(product: Product) {
  if (!product.faq || product.faq.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function categoryJsonLd(category: Category, productCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${BASE_URL}/categories/${category.slug}`,
    numberOfItems: productCount,
  };
}

