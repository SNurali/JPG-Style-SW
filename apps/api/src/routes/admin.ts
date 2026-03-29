import { Router, Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { requireAdmin, generateToken } from '../middleware/auth';
import { isDbAvailable } from '../main';
import { fallbackData } from '../data/fallback';

export const adminRouter = Router();

// Hardcoded admin for fallback mode (no DB)
const FALLBACK_ADMIN = {
  id: '1', email: 'admin@smartwash.uz', name: 'Admin',
  role: 'superadmin', passwordHash: '$2a$10$LqRqjw7sR5sE5q2r3j3H.OZrYp3j9T3c6d4Y5W7x8z1a0b2c3d4e',
  password: 'admin123', // plaintext for comparison in fallback
};

// ─── Auth ───────────────────────────────────────────────

adminRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', { email, hasPassword: !!password, bodyKeys: Object.keys(req.body), dbAvailable: isDbAvailable() });
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (isDbAvailable()) {
      const { query } = await import('../db/connection');
      const result = await query(`SELECT * FROM admin_users WHERE email = $1`, [email]);
      const user = result.rows[0];
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
      await query(`UPDATE admin_users SET last_login = NOW() WHERE id = $1`, [user.id]);
      const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });
      return res.json({ data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
    }

    // Fallback: hardcoded admin
    if (email === FALLBACK_ADMIN.email && password === FALLBACK_ADMIN.password) {
      const token = generateToken({ id: FALLBACK_ADMIN.id, email: FALLBACK_ADMIN.email, name: FALLBACK_ADMIN.name, role: FALLBACK_ADMIN.role });
      return res.json({ data: { token, user: { id: FALLBACK_ADMIN.id, email: FALLBACK_ADMIN.email, name: FALLBACK_ADMIN.name, role: FALLBACK_ADMIN.role } } });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// All routes below require admin auth
adminRouter.use(requireAdmin);

// ─── Dashboard ──────────────────────────────────────────

adminRouter.get('/dashboard', async (_req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { query } = await import('../db/connection');
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const [ordersToday, revenueToday, totalOrders, totalRevenue, totalCustomers, totalProducts, pendingOrders, pendingReviews] = await Promise.all([
        query(`SELECT COUNT(*) FROM orders WHERE created_at >= $1`, [today]),
        query(`SELECT COALESCE(SUM(total), 0) as sum FROM orders WHERE created_at >= $1 AND status != 'cancelled'`, [today]),
        query(`SELECT COUNT(*) FROM orders`),
        query(`SELECT COALESCE(SUM(total), 0) as sum FROM orders WHERE status != 'cancelled'`),
        query(`SELECT COUNT(*) FROM customers`),
        query(`SELECT COUNT(*) FROM products WHERE is_active = TRUE`),
        query(`SELECT COUNT(*) FROM orders WHERE status = 'pending'`),
        query(`SELECT COUNT(*) FROM reviews WHERE is_approved = FALSE`),
      ]);
      const recentOrders = await query(`SELECT o.*, c.first_name, c.last_name, c.phone FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.created_at DESC LIMIT 10`);
      return res.json({
        data: {
          ordersToday: parseInt(ordersToday.rows[0].count), revenueToday: parseInt(revenueToday.rows[0].sum),
          totalOrders: parseInt(totalOrders.rows[0].count), totalRevenue: parseInt(totalRevenue.rows[0].sum),
          totalCustomers: parseInt(totalCustomers.rows[0].count), totalProducts: parseInt(totalProducts.rows[0].count),
          pendingOrders: parseInt(pendingOrders.rows[0].count), pendingReviews: parseInt(pendingReviews.rows[0].count),
          recentOrders: recentOrders.rows.map((row: any) => ({
            id: row.id, orderNumber: row.order_number,
            customerName: `${row.first_name} ${row.last_name}`.trim(),
            customerPhone: row.phone, total: row.total, status: row.status,
            paymentStatus: row.payment_status, createdAt: row.created_at,
          })),
        },
      });
    }
    // Fallback dashboard
    const products = fallbackData.getProducts();
    res.json({
      data: {
        ordersToday: 0, revenueToday: 0, totalOrders: 0, totalRevenue: 0,
        totalCustomers: 0, totalProducts: products.data.length,
        pendingOrders: 0, pendingReviews: 0, recentOrders: [],
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Products ───────────────────────────────────────────

adminRouter.get('/products', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { productRepository } = await import('../repositories/product.repository');
      const result = await productRepository.findAllAdmin(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 20,
        req.query.search as string,
      );
      return res.json(result);
    }
    const result = fallbackData.getProducts({ search: req.query.search });
    res.json(result);
  } catch (err) {
    console.error('Admin products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.post('/products', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { productRepository } = await import('../repositories/product.repository');
      const product = await productRepository.create(req.body);
      return res.status(201).json({ data: product });
    }
    res.status(201).json({ data: { ...req.body, id: Date.now().toString() } });
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'Product with this slug or SKU already exists' });
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.put('/products/:id', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { productRepository } = await import('../repositories/product.repository');
      const product = await productRepository.update(req.params.id, req.body);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.json({ data: product });
    }
    res.json({ data: { id: req.params.id, ...req.body } });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { query } = await import('../db/connection');
      await query(`DELETE FROM products WHERE id = $1`, [req.params.id]);
    }
    res.json({ data: { message: 'Product deleted' } });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Categories ─────────────────────────────────────────

adminRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { categoryRepository } = await import('../repositories/category.repository');
      const categories = await categoryRepository.findAllAdmin();
      return res.json({ data: categories });
    }
    res.json({ data: fallbackData.getCategories() });
  } catch (err) {
    console.error('Admin categories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { categoryRepository } = await import('../repositories/category.repository');
      const category = await categoryRepository.create(req.body);
      return res.status(201).json({ data: category });
    }
    res.status(201).json({ data: { ...req.body, id: Date.now().toString() } });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { categoryRepository } = await import('../repositories/category.repository');
      const category = await categoryRepository.update(req.params.id, req.body);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      return res.json({ data: category });
    }
    res.json({ data: { id: req.params.id, ...req.body } });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Orders ─────────────────────────────────────────────

adminRouter.get('/orders', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { orderRepository } = await import('../repositories/order.repository');
      const result = await orderRepository.findAll({
        status: req.query.status as string, search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1, limit: parseInt(req.query.limit as string) || 20,
      });
      return res.json(result);
    }
    res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { orderRepository } = await import('../repositories/order.repository');
      const order = await orderRepository.findById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.json({ data: order });
    }
    res.status(404).json({ error: 'Order not found' });
  } catch (err) {
    console.error('Admin order detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.put('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'delivering', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid: ${validStatuses.join(', ')}` });
    }
    if (isDbAvailable()) {
      const { orderRepository } = await import('../repositories/order.repository');
      const order = await orderRepository.updateStatus(req.params.id, status);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.json({ data: order });
    }
    res.json({ data: { id: req.params.id, status } });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Customers ──────────────────────────────────────────

adminRouter.get('/customers', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { customerRepository } = await import('../repositories/customer.repository');
      const result = await customerRepository.findAll(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 20,
        req.query.search as string,
      );
      return res.json(result);
    }
    res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
  } catch (err) {
    console.error('Admin customers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Reviews ────────────────────────────────────────────

adminRouter.get('/reviews', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { reviewRepository } = await import('../repositories/review.repository');
      const pending = req.query.pending === 'true';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = pending ? await reviewRepository.findPending(page, limit) : await reviewRepository.findAll(page, limit);
      return res.json(result);
    }
    res.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
  } catch (err) {
    console.error('Admin reviews error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.put('/reviews/:id/approve', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { reviewRepository } = await import('../repositories/review.repository');
      const review = await reviewRepository.approve(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      return res.json({ data: review });
    }
    res.json({ data: { id: req.params.id, isApproved: true } });
  } catch (err) {
    console.error('Approve review error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.delete('/reviews/:id', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { reviewRepository } = await import('../repositories/review.repository');
      await reviewRepository.reject(req.params.id);
    }
    res.json({ data: { message: 'Review deleted' } });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Discounts ──────────────────────────────────────────

adminRouter.get('/discounts', async (_req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { discountRepository } = await import('../repositories/discount.repository');
      const discounts = await discountRepository.findAll();
      return res.json({ data: discounts });
    }
    res.json({ data: [] });
  } catch (err) {
    console.error('Admin discounts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.post('/discounts', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { discountRepository } = await import('../repositories/discount.repository');
      const discount = await discountRepository.create(req.body);
      return res.status(201).json({ data: discount });
    }
    res.status(201).json({ data: { ...req.body, id: Date.now().toString() } });
  } catch (err) {
    console.error('Create discount error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.put('/discounts/:id', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { discountRepository } = await import('../repositories/discount.repository');
      const discount = await discountRepository.update(req.params.id, req.body);
      if (!discount) return res.status(404).json({ error: 'Discount not found' });
      return res.json({ data: discount });
    }
    res.json({ data: { id: req.params.id, ...req.body } });
  } catch (err) {
    console.error('Update discount error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

adminRouter.delete('/discounts/:id', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { discountRepository } = await import('../repositories/discount.repository');
      await discountRepository.delete(req.params.id);
    }
    res.json({ data: { message: 'Discount deleted' } });
  } catch (err) {
    console.error('Delete discount error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Analytics ──────────────────────────────────────────

adminRouter.get('/analytics', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { query } = await import('../db/connection');
      const days = parseInt(req.query.days as string) || 30;
      const dailyRevenue = await query(`SELECT DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total), 0) as revenue FROM orders WHERE created_at >= NOW() - INTERVAL '${days} days' AND status != 'cancelled' GROUP BY DATE(created_at) ORDER BY date ASC`);
      const statusDistribution = await query(`SELECT status, COUNT(*) as count FROM orders GROUP BY status`);
      const paymentDistribution = await query(`SELECT payment_method, COUNT(*) as count FROM orders GROUP BY payment_method`);
      return res.json({ data: { dailyRevenue: dailyRevenue.rows, topProducts: [], statusDistribution: statusDistribution.rows, paymentDistribution: paymentDistribution.rows } });
    }
    res.json({ data: { dailyRevenue: [], topProducts: [], statusDistribution: [], paymentDistribution: [] } });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Change Password ────────────────────────────────────

adminRouter.post('/change-password', async (req: Request, res: Response) => {
  try {
    if (!isDbAvailable()) return res.status(400).json({ error: 'Password change requires database' });
    const { query } = await import('../db/connection');
    const { currentPassword, newPassword } = req.body;
    const adminUser = (req as any).adminUser;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Min 6 characters' });
    const result = await query(`SELECT password_hash FROM admin_users WHERE id = $1`, [adminUser.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Текущий пароль неверный' });
    const newHash = await bcrypt.hash(newPassword, 10);
    await query(`UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [newHash, adminUser.id]);
    res.json({ data: { message: 'Password changed' } });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
