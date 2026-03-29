import { query, withTransaction } from '../db/connection';

export const orderRepository = {
  async create(data: {
    customerId: string;
    items: { productId: string; productName: string; productImage?: string; quantity: number; unitPrice: number; totalPrice: number }[];
    subtotal: number;
    discountAmount: number;
    deliveryFee: number;
    total: number;
    deliveryAddress: string;
    deliveryZone: string;
    paymentMethod: string;
    notes: string;
    discountCode?: string;
  }) {
    return withTransaction(async (client) => {
      const orderNumber = generateOrderNumber();

      const result = await client.query(
        `INSERT INTO orders (order_number, customer_id, items, subtotal, discount_amount, delivery_fee, total, delivery_address, delivery_zone, payment_method, payment_status, status, notes, discount_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
        [
          orderNumber, data.customerId, JSON.stringify(data.items),
          data.subtotal, data.discountAmount, data.deliveryFee, data.total,
          data.deliveryAddress, data.deliveryZone, data.paymentMethod,
          data.paymentMethod === 'cash' ? 'pending' : 'awaiting', 'pending',
          data.notes, data.discountCode || null,
        ]
      );

      // Decrease stock for each product
      for (const item of data.items) {
        await client.query(
          `UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
          [item.quantity, item.productId]
        );
        await client.query(
          `INSERT INTO inventory_log (product_id, quantity_change, reason, reference_id) VALUES ($1, $2, $3, $4)`,
          [item.productId, -item.quantity, 'order', orderNumber]
        );
      }

      // Update customer stats
      await client.query(
        `UPDATE customers SET order_count = order_count + 1, total_spent = total_spent + $1 WHERE id = $2`,
        [data.total, data.customerId]
      );

      return mapOrderRow(result.rows[0]);
    });
  },

  async findByOrderNumber(orderNumber: string) {
    const result = await query(
      `SELECT o.*, c.first_name, c.last_name, c.phone
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       WHERE o.order_number = $1`,
      [orderNumber]
    );
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...mapOrderRow(row),
      customerName: `${row.first_name} ${row.last_name}`.trim(),
      customerPhone: row.phone,
    };
  },

  async findById(id: string) {
    const result = await query(
      `SELECT o.*, c.first_name, c.last_name, c.phone
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       WHERE o.id = $1`,
      [id]
    );
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...mapOrderRow(row),
      customerName: `${row.first_name} ${row.last_name}`.trim(),
      customerPhone: row.phone,
    };
  },

  async findAll(filters: { status?: string; page?: number; limit?: number; search?: string }) {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters.status) {
      conditions.push(`o.status = $${idx++}`);
      params.push(filters.status);
    }
    if (filters.search) {
      conditions.push(`(o.order_number ILIKE $${idx} OR c.phone ILIKE $${idx} OR c.first_name ILIKE $${idx})`);
      params.push(`%${filters.search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(50, Math.max(1, filters.limit || 20));
    const offset = (page - 1) * limit;

    const countResult = await query(
      `SELECT COUNT(*) FROM orders o JOIN customers c ON o.customer_id = c.id ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT o.*, c.first_name, c.last_name, c.phone
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       ${where}
       ORDER BY o.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows.map((row) => ({
        ...mapOrderRow(row),
        customerName: `${row.first_name} ${row.last_name}`.trim(),
        customerPhone: row.phone,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async updateStatus(id: string, status: string) {
    const result = await query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] ? mapOrderRow(result.rows[0]) : null;
  },

  async updatePaymentStatus(id: string, paymentStatus: string) {
    const result = await query(
      `UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *`,
      [paymentStatus, id]
    );
    return result.rows[0] ? mapOrderRow(result.rows[0]) : null;
  },

  async updateTelegramMsgId(id: string, msgId: string) {
    await query(`UPDATE orders SET telegram_msg_id = $1 WHERE id = $2`, [msgId, id]);
  },
};

function generateOrderNumber(): string {
  return 'SW-' + String(Math.floor(Math.random() * 90000) + 10000);
}

function mapOrderRow(row: any) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    subtotal: row.subtotal,
    discountAmount: row.discount_amount,
    deliveryFee: row.delivery_fee,
    total: row.total,
    deliveryAddress: row.delivery_address,
    deliveryZone: row.delivery_zone,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    status: row.status,
    notes: row.notes,
    discountCode: row.discount_code,
    telegramMsgId: row.telegram_msg_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
