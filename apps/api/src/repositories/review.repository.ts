import { query } from '../db/connection';

export const reviewRepository = {
  async findByProduct(productId: string) {
    const result = await query(
      `SELECT * FROM reviews WHERE product_id = $1 AND is_approved = TRUE ORDER BY created_at DESC`,
      [productId]
    );
    return result.rows.map(mapReviewRow);
  },

  async create(data: { productId: string; customerId?: string; customerName: string; rating: number; comment: string }) {
    const result = await query(
      `INSERT INTO reviews (product_id, customer_id, customer_name, rating, comment, is_approved)
       VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING *`,
      [data.productId, data.customerId || null, data.customerName, data.rating, data.comment]
    );
    return mapReviewRow(result.rows[0]);
  },

  async approve(id: string) {
    const result = await query(
      `UPDATE reviews SET is_approved = TRUE WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows[0]) {
      // Update product rating
      const productId = result.rows[0].product_id;
      await query(
        `UPDATE products
         SET rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = $1 AND is_approved = TRUE),
             review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = $1 AND is_approved = TRUE)
         WHERE id = $1`,
        [productId]
      );
    }
    return result.rows[0] ? mapReviewRow(result.rows[0]) : null;
  },

  async reject(id: string) {
    await query(`DELETE FROM reviews WHERE id = $1`, [id]);
  },

  async findPending(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const countResult = await query(`SELECT COUNT(*) FROM reviews WHERE is_approved = FALSE`);
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT r.*, p.name as product_name
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE r.is_approved = FALSE
       ORDER BY r.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return {
      data: result.rows.map((row) => ({ ...mapReviewRow(row), productName: row.product_name })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const countResult = await query(`SELECT COUNT(*) FROM reviews`);
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT r.*, p.name as product_name
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       ORDER BY r.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return {
      data: result.rows.map((row) => ({ ...mapReviewRow(row), productName: row.product_name })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};

function mapReviewRow(row: any) {
  return {
    id: row.id,
    productId: row.product_id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    rating: row.rating,
    comment: row.comment,
    isApproved: row.is_approved,
    createdAt: row.created_at,
  };
}
