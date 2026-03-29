import { query } from '../db/connection';

export const categoryRepository = {
  async findAll() {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = TRUE) as product_count
       FROM categories c
       WHERE c.is_active = TRUE
       ORDER BY c.sort_order ASC`
    );
    return result.rows.map(mapCategoryRow);
  },

  async findBySlug(slug: string) {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = TRUE) as product_count
       FROM categories c
       WHERE c.slug = $1 AND c.is_active = TRUE`,
      [slug]
    );
    return result.rows[0] ? mapCategoryRow(result.rows[0]) : null;
  },

  async findById(id: string) {
    const result = await query(`SELECT * FROM categories WHERE id = $1`, [id]);
    return result.rows[0] ? mapCategoryRow(result.rows[0]) : null;
  },

  async create(data: { name: string; slug: string; description: string; image?: string; sortOrder?: number }) {
    const result = await query(
      `INSERT INTO categories (name, slug, description, image, sort_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.name, data.slug, data.description, data.image || '', data.sortOrder || 0]
    );
    return mapCategoryRow(result.rows[0]);
  },

  async update(id: string, data: any) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); params.push(data.name); }
    if (data.slug !== undefined) { fields.push(`slug = $${idx++}`); params.push(data.slug); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); params.push(data.description); }
    if (data.image !== undefined) { fields.push(`image = $${idx++}`); params.push(data.image); }
    if (data.sortOrder !== undefined) { fields.push(`sort_order = $${idx++}`); params.push(data.sortOrder); }
    if (data.isActive !== undefined) { fields.push(`is_active = $${idx++}`); params.push(data.isActive); }

    if (fields.length === 0) return null;

    params.push(id);
    const result = await query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return result.rows[0] ? mapCategoryRow(result.rows[0]) : null;
  },

  async findAllAdmin() {
    const result = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as product_count
       FROM categories c
       ORDER BY c.sort_order ASC`
    );
    return result.rows.map(mapCategoryRow);
  },
};

function mapCategoryRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    productCount: parseInt(row.product_count || '0'),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
