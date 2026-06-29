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

  // ─── Auth (storefront customers) ──────────────────────

  async findByEmail(email: string) {
    const result = await query(`SELECT * FROM customers WHERE lower(email) = lower($1) LIMIT 1`, [email]);
    return result.rows[0] || null;
  },

  async findByPhone(phone: string) {
    const result = await query(`SELECT * FROM customers WHERE phone = $1 LIMIT 1`, [phone]);
    return result.rows[0] || null;
  },

  async findByGoogleId(googleId: string) {
    const result = await query(`SELECT * FROM customers WHERE google_id = $1 LIMIT 1`, [googleId]);
    return result.rows[0] || null;
  },

  /** Create a customer with email+password credentials. */
  async createWithPassword(data: { name: string; email: string; phone?: string; passwordHash: string }) {
    const [firstName, ...lastParts] = data.name.trim().split(' ');
    const result = await query(
      `INSERT INTO customers (first_name, last_name, name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [firstName, lastParts.join(' '), data.name.trim(), data.email.toLowerCase(), data.phone || null, data.passwordHash]
    );
    return mapCustomerRow(result.rows[0]);
  },

  /** Create or link a customer from a verified Google profile. */
  async upsertGoogle(data: { googleId: string; email: string; name: string }) {
    const existingByGoogle = await this.findByGoogleId(data.googleId);
    if (existingByGoogle) return mapCustomerRow(existingByGoogle);

    const existingByEmail = data.email ? await this.findByEmail(data.email) : null;
    if (existingByEmail) {
      const upd = await query(`UPDATE customers SET google_id = $1 WHERE id = $2 RETURNING *`, [data.googleId, existingByEmail.id]);
      return mapCustomerRow(upd.rows[0]);
    }

    const [firstName, ...lastParts] = (data.name || 'Клиент').trim().split(' ');
    const result = await query(
      `INSERT INTO customers (first_name, last_name, name, email, google_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [firstName, lastParts.join(' '), data.name.trim(), data.email ? data.email.toLowerCase() : null, data.googleId]
    );
    return mapCustomerRow(result.rows[0]);
  },

  /** Update editable profile fields (name, phone). */
  async updateProfile(id: string, data: { name?: string; phone?: string }) {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;
    if (data.name !== undefined) {
      const [firstName, ...lastParts] = data.name.trim().split(' ');
      fields.push(`first_name = $${idx++}`); params.push(firstName);
      fields.push(`last_name = $${idx++}`); params.push(lastParts.join(' '));
      fields.push(`name = $${idx++}`); params.push(data.name.trim());
    }
    if (data.phone !== undefined) { fields.push(`phone = $${idx++}`); params.push(data.phone || null); }
    if (fields.length === 0) return this.findById(id);
    params.push(id);
    const result = await query(`UPDATE customers SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, params);
    return result.rows[0] ? mapCustomerRow(result.rows[0]) : null;
  },

  /** Order history for a customer. */
  async findOrders(customerId: string) {
    const result = await query(
      `SELECT order_number, items, subtotal, discount_amount, delivery_fee, total,
              status, payment_method, payment_status, created_at
       FROM orders WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 100`,
      [customerId]
    );
    return result.rows.map((row: any) => ({
      orderNumber: row.order_number,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
      subtotal: row.subtotal,
      discountAmount: row.discount_amount,
      deliveryFee: row.delivery_fee,
      total: row.total,
      status: row.status,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      createdAt: row.created_at,
    }));
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
    name: row.name || `${row.first_name || ''} ${row.last_name || ''}`.trim(),
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    email: row.email,
    hasPassword: !!row.password_hash,
    googleLinked: !!row.google_id,
    telegramId: row.telegram_id,
    addresses: typeof row.addresses === 'string' ? JSON.parse(row.addresses) : row.addresses,
    orderCount: row.order_count,
    totalSpent: parseInt(row.total_spent),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
