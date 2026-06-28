import { query } from './connection';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

export async function seed() {
  console.log('🌱 Seeding database...');

  // Check if already seeded
  const existing = await query('SELECT COUNT(*) FROM categories');
  if (parseInt(existing.rows[0].count) > 0) {
    console.log('⏭️  Database already seeded, skipping');
    return;
  }

  // ─── Categories (реальная линейка SmartWash) ────────
  const categories = [
    { id: uuidv4(), name: 'Автошампуни', slug: 'auto-shampoo', description: 'Бесконтактные автошампуни для автомоек', image: '/images/categories/shampoo.webp', sortOrder: 1 },
    { id: uuidv4(), name: 'Воск', slug: 'wax', description: 'Воски для блеска и защиты кузова', image: '/images/categories/wax.webp', sortOrder: 2 },
    { id: uuidv4(), name: 'Чернитель шин', slug: 'tire-blackener', description: 'Средства для ухода за резиной', image: '/images/categories/tire.webp', sortOrder: 3 },
    { id: uuidv4(), name: 'Сухой туман', slug: 'dry-fog', description: 'Ароматизация и устранение запахов в салоне', image: '/images/categories/fog.webp', sortOrder: 4 },
    { id: uuidv4(), name: 'Грузовая химия', slug: 'truck-chemicals', description: 'Активная химия для грузового транспорта', image: '/images/categories/chemicals.webp', sortOrder: 5 },
  ];

  for (const cat of categories) {
    await query(
      `INSERT INTO categories (id, name, slug, description, image, sort_order) VALUES ($1, $2, $3, $4, $5, $6)`,
      [cat.id, cat.name, cat.slug, cat.description, cat.image, cat.sortOrder]
    );
  }
  console.log(`  ✅ ${categories.length} categories seeded`);

  const catBySlug = (slug: string) => categories.find((c) => c.slug === slug)!.id;

  // ─── Products (реальный каталог SmartWash, цены 2026-06-29) ───
  const products = [
    {
      name: 'Автошампунь бесконтактный, розовая пена — 20 кг', slug: 'pink-shampoo-20kg',
      description: 'Бесконтактный автошампунь с активной розовой пеной. Густая стойкая пена, мощное отмывание в условиях ташкентской пыли, экономичный расход, безопасен для ЛКП. Для любых автомобилей.',
      price: 500000, compareAtPrice: null, sku: 'SW-SH-PINK-20',
      categoryId: catBySlug('auto-shampoo'), isBestseller: true, isNew: true, stock: 50,
      rating: 4.9, reviewCount: 27, images: ['/products/pink-shampoo-20kg.png'],
    },
    {
      name: 'Автошампунь бесконтактный, белая пена — 20 кг', slug: 'white-shampoo-20kg',
      description: 'Бесконтактный автошампунь с густой белой пеной. Отмывает сильные загрязнения после ташкентских дорог практически с одного нанесения, экономичный расход, безопасен для лакокрасочного покрытия.',
      price: 450000, compareAtPrice: null, sku: 'SW-SH-WHITE-20',
      categoryId: catBySlug('auto-shampoo'), isBestseller: true, isNew: true, stock: 50,
      rating: 4.8, reviewCount: 21, images: ['/products/white-shampoo-20kg.png'],
    },
    {
      name: 'Нано-шампунь — 5 кг', slug: 'nano-shampoo-5kg',
      description: 'Нано-шампунь для ручной мойки. Усиливает блеск, добавляет защиту и приятный аромат после мойки.',
      price: 300000, compareAtPrice: null, sku: 'SW-SH-NANO-5',
      categoryId: catBySlug('auto-shampoo'), isBestseller: true, isNew: false, stock: 40,
      rating: 4.8, reviewCount: 19, images: ['/products/nano-shampoo-5l.png'],
    },
    {
      name: 'Воск для автомойки — 5 кг', slug: 'wax-5kg',
      description: 'Жидкий воск для блеска и защиты кузова. Водоотталкивающий эффект и глубокий блеск после мойки.',
      price: 200000, compareAtPrice: null, sku: 'SW-WX-5',
      categoryId: catBySlug('wax'), isBestseller: true, isNew: false, stock: 35,
      rating: 4.8, reviewCount: 22, images: ['/products/wax-bubblegum-5l.png'],
    },
    {
      name: 'Чернитель резины — 10 л', slug: 'tire-shine-10l',
      description: 'Чернитель резины: глубокий насыщенный «мокрый» чёрный цвет, держится 7–10 дней. Не оставляет жирных следов на пластике и дисках.',
      price: 150000, compareAtPrice: null, sku: 'SW-TB-10',
      categoryId: catBySlug('tire-blackener'), isBestseller: true, isNew: false, stock: 40,
      rating: 4.7, reviewCount: 17, images: ['/products/tire-shine-glossy.png'],
    },
    {
      name: 'Сухой туман — ароматизатор салона, 450 мл', slug: 'dry-fog-450ml',
      description: 'Сухой туман для ароматизации и устранения запахов в салоне. Разные ароматы на выбор, долгосрочная свежесть.',
      price: 100000, compareAtPrice: null, sku: 'SW-DF-450',
      categoryId: catBySlug('dry-fog'), isBestseller: true, isNew: true, stock: 60,
      rating: 4.6, reviewCount: 12, images: ['/products/dry-fog-450ml.png'],
    },
    {
      name: 'Активная химия для грузовых авто — 20 кг', slug: 'truck-chemistry-20kg',
      description: 'Активная химия для грузового транспорта. Мощное средство для больших объёмов и сильных загрязнений.',
      price: 450000, compareAtPrice: null, sku: 'SW-TR-20',
      categoryId: catBySlug('truck-chemicals'), isBestseller: false, isNew: false, stock: 25,
      rating: 4.7, reviewCount: 8, images: ['/products/truck-chemistry-20kg.png'],
    },
  ];

  for (const p of products) {
    await query(
      `INSERT INTO products (name, slug, description, price, compare_at_price, sku, category_id, is_bestseller, is_new, stock, rating, review_count, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [p.name, p.slug, p.description, p.price, p.compareAtPrice, p.sku, p.categoryId, p.isBestseller, p.isNew, p.stock, p.rating, p.reviewCount, JSON.stringify(p.images)]
    );
  }
  console.log(`  ✅ ${products.length} products seeded`);

  // ─── Reviews ────────────────────────────────────────
  const productRows = await query<{ id: string; slug: string }>('SELECT id, slug FROM products');
  const productMap = new Map(productRows.rows.map((r) => [r.slug, r.id]));

  const reviews = [
    { productSlug: 'pink-shampoo-20kg', customerName: 'Сардор Т.', rating: 5, comment: 'Розовая пена — огонь! Грязь сходит без контакта, машина блестит. Для мойки берём только её.' },
    { productSlug: 'white-shampoo-20kg', customerName: 'Дильшод К.', rating: 5, comment: 'Белая пена отмывает ташкентскую пыль на ура, расход экономный. Берём канистрами.' },
    { productSlug: 'tire-shine-10l', customerName: 'Жасур Н.', rating: 5, comment: 'Чернитель — эффект мокрых шин держится больше недели. Клиенты доплачивают с радостью.' },
    { productSlug: 'wax-5kg', customerName: 'Алишер М.', rating: 5, comment: 'Воск даёт реальный блеск, вода скатывается шариками. Средний чек подрос.' },
    { productSlug: 'truck-chemistry-20kg', customerName: 'Бекзод Р.', rating: 5, comment: 'Для фур то что надо — мощная химия, отмывает дорожную грязь.' },
  ];

  for (const r of reviews) {
    const productId = productMap.get(r.productSlug);
    if (productId) {
      await query(
        `INSERT INTO reviews (product_id, customer_name, rating, comment, is_approved) VALUES ($1, $2, $3, $4, TRUE)`,
        [productId, r.customerName, r.rating, r.comment]
      );
    }
  }
  console.log(`  ✅ ${reviews.length} reviews seeded`);

  // ─── Admin User ─────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123', 12);
  await query(
    `INSERT INTO admin_users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)`,
    ['admin@smartwash.uz', passwordHash, 'Admin', 'admin']
  );
  console.log('  ✅ Admin user created (admin@smartwash.uz / admin123)');

  // ─── Sample Discount ────────────────────────────────
  await query(
    `INSERT INTO discounts (code, type, value, min_order, max_uses) VALUES ($1, $2, $3, $4, $5)`,
    ['WELCOME10', 'percentage', 10, 100000, 100]
  );
  console.log('  ✅ Sample discount created (WELCOME10)');

  console.log('🌱 Seeding complete!');
}

// Run directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
