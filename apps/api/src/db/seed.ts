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

  // ─── Categories ─────────────────────────────────────
  const categories = [
    { id: uuidv4(), name: 'Автошампуни', slug: 'auto-shampoo', description: 'Профессиональные шампуни для ручной и бесконтактной мойки', image: '/images/categories/shampoo.webp', sortOrder: 1 },
    { id: uuidv4(), name: 'Нано покрытия', slug: 'nano-coating', description: 'Защитные нано-покрытия для кузова и стёкол', image: '/images/categories/nano.webp', sortOrder: 2 },
    { id: uuidv4(), name: 'Воск', slug: 'wax', description: 'Автомобильный воск для блеска и защиты', image: '/images/categories/wax.webp', sortOrder: 3 },
    { id: uuidv4(), name: 'Чернитель шин', slug: 'tire-blackener', description: 'Средства для ухода за шинами и резиной', image: '/images/categories/tire.webp', sortOrder: 4 },
    { id: uuidv4(), name: 'Сухой туман', slug: 'dry-fog', description: 'Ароматизация и устранение запахов в салоне', image: '/images/categories/fog.webp', sortOrder: 5 },
    { id: uuidv4(), name: 'Очистители салона', slug: 'interior-cleaners', description: 'Средства для чистки кожи, пластика и ткани', image: '/images/categories/interior.webp', sortOrder: 6 },
    { id: uuidv4(), name: 'Аксессуары', slug: 'accessories', description: 'Микрофибры, аппликаторы, полировальные круги', image: '/images/categories/accessories.webp', sortOrder: 7 },
    { id: uuidv4(), name: 'Химия для детейлинга', slug: 'detailing-chemicals', description: 'Профессиональная химия для детейлинг-студий', image: '/images/categories/chemicals.webp', sortOrder: 8 },
  ];

  for (const cat of categories) {
    await query(
      `INSERT INTO categories (id, name, slug, description, image, sort_order) VALUES ($1, $2, $3, $4, $5, $6)`,
      [cat.id, cat.name, cat.slug, cat.description, cat.image, cat.sortOrder]
    );
  }
  console.log(`  ✅ ${categories.length} categories seeded`);

  // ─── Products ───────────────────────────────────────
  const products = [
    {
      name: 'SmartWash Auto Shampoo 1L', slug: 'smartwash-auto-shampoo-1l',
      description: 'Концентрированный автошампунь для ручной мойки с нейтральным pH. Бережно очищает лакокрасочное покрытие, создаёт обильную пену. Разбавление 1:200.',
      price: 85000, compareAtPrice: 120000, sku: 'SW-SH-001',
      categoryId: categories[0].id, isBestseller: true, isNew: false, stock: 45,
      rating: 4.8, reviewCount: 23, images: ['/images/products/shampoo-1l.webp'],
    },
    {
      name: 'NanoShield Pro Coating', slug: 'nanoshield-pro-coating',
      description: 'Керамическое нано-покрытие с эффектом гидрофоба. Защита до 12 месяцев. Придаёт глубокий блеск и защищает от царапин.',
      price: 250000, compareAtPrice: null, sku: 'SW-NC-001',
      categoryId: categories[1].id, isBestseller: true, isNew: true, stock: 12,
      rating: 4.9, reviewCount: 15, images: ['/images/products/nano-coating.webp'],
    },
    {
      name: 'Premium Carnauba Wax', slug: 'premium-carnauba-wax',
      description: 'Натуральный воск карнаубы высшего качества. Придаёт глубокий мокрый блеск. Защита до 3 месяцев.',
      price: 180000, compareAtPrice: 220000, sku: 'SW-WX-001',
      categoryId: categories[2].id, isBestseller: true, isNew: false, stock: 28,
      rating: 4.7, reviewCount: 31, images: ['/images/products/wax.webp'],
    },
    {
      name: 'BlackMax Tire Gel', slug: 'blackmax-tire-gel',
      description: 'Гель-чернитель для шин с долговременным эффектом. Защищает от растрескивания, придаёт насыщенный чёрный цвет.',
      price: 65000, compareAtPrice: null, sku: 'SW-TB-001',
      categoryId: categories[3].id, isBestseller: false, isNew: false, stock: 56,
      rating: 4.5, reviewCount: 18, images: ['/images/products/tire-gel.webp'],
    },
    {
      name: 'FreshFog Lavender', slug: 'freshfog-lavender',
      description: 'Сухой туман с ароматом лаванды. Полностью устраняет неприятные запахи в салоне за 15 минут.',
      price: 45000, compareAtPrice: null, sku: 'SW-DF-001',
      categoryId: categories[4].id, isBestseller: false, isNew: true, stock: 3,
      rating: 4.6, reviewCount: 9, images: ['/images/products/dry-fog.webp'],
    },
    {
      name: 'LeatherCare Pro Kit', slug: 'leathercare-pro-kit',
      description: 'Набор для ухода за кожаным салоном: очиститель + кондиционер. Восстанавливает мягкость и цвет кожи.',
      price: 320000, compareAtPrice: 400000, sku: 'SW-IC-001',
      categoryId: categories[5].id, isBestseller: true, isNew: false, stock: 8,
      rating: 4.9, reviewCount: 42, images: ['/images/products/leather-kit.webp'],
    },
    {
      name: 'Microfiber Towel Pack (5шт)', slug: 'microfiber-towel-pack-5',
      description: 'Набор из 5 микрофибровых полотенец 40x40 см, плотность 400 GSM. Идеально для полировки и сушки.',
      price: 95000, compareAtPrice: null, sku: 'SW-AC-001',
      categoryId: categories[6].id, isBestseller: false, isNew: false, stock: 120,
      rating: 4.4, reviewCount: 55, images: ['/images/products/microfiber.webp'],
    },
    {
      name: 'Iron Remover 500ml', slug: 'iron-remover-500ml',
      description: 'Очиститель металлических вкраплений (fallout remover). Меняет цвет при контакте с железом. pH-нейтральный.',
      price: 135000, compareAtPrice: null, sku: 'SW-DC-001',
      categoryId: categories[7].id, isBestseller: false, isNew: true, stock: 22,
      rating: 4.7, reviewCount: 11, images: ['/images/products/iron-remover.webp'],
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
    { productSlug: 'smartwash-auto-shampoo-1l', customerName: 'Сардор Т.', rating: 5, comment: 'Шампунь просто огонь! Пена густая, машина блестит как новая. Рекомендую всем!' },
    { productSlug: 'nanoshield-pro-coating', customerName: 'Дильшод К.', rating: 5, comment: 'Нано покрытие держится уже 6 месяцев, вода скатывается идеально. Лучшее что пробовал.' },
    { productSlug: 'premium-carnauba-wax', customerName: 'Алишер М.', rating: 4, comment: 'Воск карнаубы — отличный блеск! Наносится легко, полируется без усилий.' },
    { productSlug: 'leathercare-pro-kit', customerName: 'Бехзод Р.', rating: 5, comment: 'Заказываю уже третий раз, качество всегда на высоте. Доставка быстрая!' },
    { productSlug: 'blackmax-tire-gel', customerName: 'Жасур Н.', rating: 5, comment: 'Чернитель шин — вещь! Эффект мокрых шин сохраняется неделю. Супер!' },
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
