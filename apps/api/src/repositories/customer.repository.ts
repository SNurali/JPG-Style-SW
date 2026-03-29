import { query } from '../db/connection';

export const customerRepository = {
  /**
   * Find or create a customer by phone number.
   * Upserts: creates if not found, returns existing if found.
   */
  async findOrCreate(data: { firstName: string; lastName?: string; phone: string; address?: string; zone?: string }) {
    // Try to find existing
    let result = await query(`SELECT * FROM customers WHERE phone = $1`, [data.phone]);

    if (result.rows[0]) {
      const customer = result.rows[0];

      // Update name if empty
      if (!customer.first_name && data.firstName) {
        await query(`UPDATE customers SET first_name = $1, last_name = $2 WHERE id = $3`, [
          data.firstName, data.lastName || '', customer.id,
        ]);
      }

      // Add address if new
      if (data.address) {
        const addresses = Array.isArray(customer.addresses) ? customer.addresses : [];
        const exists = addresses.some((a: any) => a.address === data.address);
        if (!exists) {
          addresses.push({ address: data.address, zone: data.zone || '' });
          await query(`UPDATE customers SET addresses = $1 WHERE id = $2`, [JSON.stringify(addresses), customer.id]);
        }
      }

      return mapCustomerRow((await query(`SELECT * FROM customers WHERE id = $1`, [customer.id])).rows[0]);
    }

    // Create new
    const addresses = data.address ? [{ address: data.address, zone: data.zone || '' }] : [];
    result = await query(
      `INSERT INTO customers (first_name, last_name, phone, addresses) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.firstName, data.lastName || '', data.phone, JSON.stringify(addresses)]
    );
    return mapCustomerRow(result.rows[0]);
  },

  async findById(id: string) {
    const result = await query(`SELECT * FROM customers WHERE id = $1`, [id]);
    return result.rows[0] ? mapCustomerRow(result.rows[0]) : null;
  },

  async findAll(page = 1, limit = 20, search?: string) {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(phone ILIKE $${idx} OR first_name ILIKE $${idx} OR last_name ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countResult = await query(`SELECT COUNT(*) FROM customers ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT * FROM customers ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows.map(mapCustomerRow),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};

function mapCustomerRow(row: any) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    email: row.email,
    telegramId: row.telegram_id,
    addresses: typeof row.addresses === 'string' ? JSON.parse(row.addresses) : row.addresses,
    orderCount: row.order_count,
    totalSpent: parseInt(row.total_spent),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
