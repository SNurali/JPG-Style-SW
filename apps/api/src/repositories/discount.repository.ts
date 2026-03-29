import { query } from '../db/connection';

export const discountRepository = {
  async validate(code: string, orderTotal: number) {
    const result = await query(
      `SELECT * FROM discounts
       WHERE code = $1 AND is_active = TRUE
       AND starts_at <= NOW() AND expires_at >= NOW()
       AND (max_uses = 0 OR used_count < max_uses)`,
      [code.toUpperCase()]
    );

    if (!result.rows[0]) {
      return { valid: false, error: 'Промокод недействителен или истёк' };
    }

    const discount = mapDiscountRow(result.rows[0]);

    if (orderTotal < discount.minOrder) {
      return { valid: false, error: `Минимальная сумма заказа: ${discount.minOrder} сўм` };
    }

    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = Math.round(orderTotal * discount.value / 100);
    } else {
      discountAmount = discount.value;
    }

    return { valid: true, discount, discountAmount };
  },

  async use(code: string) {
    await query(
      `UPDATE discounts SET used_count = used_count + 1 WHERE code = $1`,
      [code.toUpperCase()]
    );
  },

  async findAll() {
    const result = await query(`SELECT * FROM discounts ORDER BY created_at DESC`);
    return result.rows.map(mapDiscountRow);
  },

  async create(data: {
    code: string; type: string; value: number;
    minOrder?: number; maxUses?: number;
    startsAt?: string; expiresAt?: string;
  }) {
    const result = await query(
      `INSERT INTO discounts (code, type, value, min_order, max_uses, starts_at, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        data.code.toUpperCase(), data.type, data.value,
        data.minOrder || 0, data.maxUses || 0,
        data.startsAt || new Date().toISOString(),
        data.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ]
    );
    return mapDiscountRow(result.rows[0]);
  },

  async update(id: string, data: any) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (data.code !== undefined) { fields.push(`code = $${idx++}`); params.push(data.code.toUpperCase()); }
    if (data.type !== undefined) { fields.push(`type = $${idx++}`); params.push(data.type); }
    if (data.value !== undefined) { fields.push(`value = $${idx++}`); params.push(data.value); }
    if (data.minOrder !== undefined) { fields.push(`min_order = $${idx++}`); params.push(data.minOrder); }
    if (data.maxUses !== undefined) { fields.push(`max_uses = $${idx++}`); params.push(data.maxUses); }
    if (data.isActive !== undefined) { fields.push(`is_active = $${idx++}`); params.push(data.isActive); }
    if (data.startsAt !== undefined) { fields.push(`starts_at = $${idx++}`); params.push(data.startsAt); }
    if (data.expiresAt !== undefined) { fields.push(`expires_at = $${idx++}`); params.push(data.expiresAt); }

    if (fields.length === 0) return null;
    params.push(id);

    const result = await query(
      `UPDATE discounts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return result.rows[0] ? mapDiscountRow(result.rows[0]) : null;
  },

  async delete(id: string) {
    await query(`DELETE FROM discounts WHERE id = $1`, [id]);
  },
};

function mapDiscountRow(row: any) {
  return {
    id: row.id,
    code: row.code,
    type: row.type as 'percentage' | 'fixed',
    value: row.value,
    minOrder: row.min_order,
    maxUses: row.max_uses,
    usedCount: row.used_count,
    isActive: row.is_active,
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}
