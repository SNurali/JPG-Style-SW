import { query } from '../db/connection';

export const productRepository = {
  async findAll(filters: {
    category?: string;
    search?: string;
    bestsellers?: boolean;
    isNew?: boolean;
    page?: number;
    limit?: number;
  }) {
    const conditions: string[] = ['p.is_active = TRUE'];
    const params: any[] = [];
    let paramIdx = 1;

    if (filters.category) {
      conditions.push(`c.slug = $${paramIdx++}`);
      params.push(filters.category);
    }
    if (filters.bestsellers) {
      conditions.push(`p.is_bestseller = TRUE`);
    }
    if (filters.isNew) {
      conditions.push(`p.is_new = TRUE`);
    }
    if (filters.search) {
      conditions.push(`(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx})`);
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    const where = conditions.join(' AND ');
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(50, Math.max(1, filters.limit || 20));
    const offset = (page - 1) * limit;

    const countResult = await query(
      `SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id WHERE ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE ${where}
       ORDER BY p.created_at DESC
       LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows.map(mapProductRow),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findBySlug(slug: string) {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.is_active = TRUE`,
      [slug]
    );
    return result.rows[0] ? mapProductRow(result.rows[0]) : null;
  },

  async findById(id: string) {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0] ? mapProductRow(result.rows[0]) : null;
  },

  async findBestsellers() {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = TRUE AND p.is_bestseller = TRUE
       ORDER BY p.review_count DESC`
    );
    return result.rows.map(mapProductRow);
  },

  async findNew() {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = TRUE AND p.is_new = TRUE
       ORDER BY p.created_at DESC`
    );
    return result.rows.map(mapProductRow);
  },

  async create(data: any) {
    const result = await query(
      `INSERT INTO products (name, slug, description, price, compare_at_price, sku, category_id, is_bestseller, is_new, stock, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [data.name, data.slug, data.description, data.price, data.compareAtPrice || null, data.sku, data.categoryId, data.isBestseller || false, data.isNew || false, data.stock || 0, JSON.stringify(data.images || [])]
    );
    return mapProductRow(result.rows[0]);
  },

  async update(id: string, data: any) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;

    const fieldMap: Record<string, string> = {
      name: 'name', slug: 'slug', description: 'description', price: 'price',
      compareAtPrice: 'compare_at_price', sku: 'sku', categoryId: 'category_id',
      isBestseller: 'is_bestseller', isNew: 'is_new', isActive: 'is_active',
      stock: 'stock', rating: 'rating', reviewCount: 'review_count',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        fields.push(`${col} = $${idx++}`);
        params.push(data[key]);
      }
    }

    if (data.images !== undefined) {
      fields.push(`images = $${idx++}`);
      params.push(JSON.stringify(data.images));
    }

    if (fields.length === 0) return null;

    params.push(id);
    const result = await query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return result.rows[0] ? mapProductRow(result.rows[0]) : null;
  },

  async updateStock(id: string, quantityChange: number, reason: string, referenceId?: string) {
    await query(`UPDATE products SET stock = GREATEST(0, stock + $1) WHERE id = $2`, [quantityChange, id]);
    await query(
      `INSERT INTO inventory_log (product_id, quantity_change, reason, reference_id) VALUES ($1, $2, $3, $4)`,
      [id, quantityChange, reason, referenceId || null]
    );
  },

  async findAllAdmin(page = 1, limit = 20, search?: string) {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(p.name ILIKE $${idx} OR p.sku ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countResult = await query(`SELECT COUNT(*) FROM products p ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows.map(mapProductRow),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};

function mapProductRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    sku: row.sku,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    isBestseller: row.is_bestseller,
    isNew: row.is_new,
    isActive: row.is_active,
    stock: row.stock,
    rating: parseFloat(row.rating),
    reviewCount: row.review_count,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    image: (typeof row.images === 'string' ? JSON.parse(row.images) : row.images)?.[0] || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
