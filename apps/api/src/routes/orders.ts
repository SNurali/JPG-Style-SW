import { Router, Request, Response } from 'express';
import { isDbAvailable } from '../main';
import { fallbackData } from '../data/fallback';
import { telegramService } from '../services/telegram.service';

export const ordersRouter = Router();

ordersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, items, deliveryAddress, deliveryZone, deliveryFee, paymentMethod, notes, discountCode, location } = req.body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: customerName, customerPhone, items' });
    }

    if (isDbAvailable()) {
      // Full DB flow
      const { customerRepository } = await import('../repositories/customer.repository');
      const { productRepository } = await import('../repositories/product.repository');
      const { orderRepository } = await import('../repositories/order.repository');
      const { discountRepository } = await import('../repositories/discount.repository');

      const [firstName, ...lastParts] = customerName.trim().split(' ');
      const customer = await customerRepository.findOrCreate({
        firstName, lastName: lastParts.join(' '), phone: customerPhone,
        address: deliveryAddress, zone: deliveryZone,
      });

      let subtotal = 0;
      const orderItems = [];
      for (const item of items) {
        const product = await productRepository.findById(item.productId);
        if (!product) return res.status(400).json({ error: `Product not found: ${item.productId}` });
        if (product.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        const totalPrice = product.price * item.quantity;
        subtotal += totalPrice;
        orderItems.push({ productId: product.id, productName: product.name, productImage: product.image, quantity: item.quantity, unitPrice: product.price, totalPrice });
      }

      let discountAmount = 0;
      if (discountCode) {
        const dr = await discountRepository.validate(discountCode, subtotal);
        if (!dr.valid) return res.status(400).json({ error: dr.error });
        discountAmount = dr.discountAmount || 0;
      }

      const total = subtotal - discountAmount + (deliveryFee || 0);
      const order = await orderRepository.create({ customerId: customer.id, items: orderItems, subtotal, discountAmount, deliveryFee: deliveryFee || 0, total, deliveryAddress: deliveryAddress || '', deliveryZone: deliveryZone || '', paymentMethod: paymentMethod || 'cash', notes: notes || '', discountCode });
      if (discountCode) await discountRepository.use(discountCode);

      const msgId = await telegramService.sendOrderNotification({ orderNumber: order.orderNumber, customerName, customerPhone, items: orderItems, subtotal, discountAmount, deliveryFee: deliveryFee || 0, total, deliveryAddress: deliveryAddress || '', deliveryZone: deliveryZone || '', paymentMethod: paymentMethod || 'cash', notes: notes || '', location });
      if (msgId) await orderRepository.updateTelegramMsgId(order.id, msgId);

      return res.status(201).json({ data: { orderNumber: order.orderNumber, status: order.status, total: order.total } });
    }

    // Fallback: in-memory
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = fallbackData.getProductById(item.productId);
      if (!product) return res.status(400).json({ error: `Product not found: ${item.productId}` });
      const totalPrice = product.price * item.quantity;
      subtotal += totalPrice;
      orderItems.push({ productId: product.id, productName: product.name, quantity: item.quantity, unitPrice: product.price, totalPrice });
    }
    const total = subtotal + (deliveryFee || 0);
    const order = fallbackData.createOrder({ customerName, customerPhone, items: orderItems, subtotal, discountAmount: 0, deliveryFee: deliveryFee || 0, total, deliveryAddress, deliveryZone, paymentMethod, notes });

    await telegramService.sendOrderNotification({ orderNumber: order.orderNumber, customerName, customerPhone, items: orderItems, subtotal, discountAmount: 0, deliveryFee: deliveryFee || 0, total, deliveryAddress: deliveryAddress || '', deliveryZone: deliveryZone || '', paymentMethod: paymentMethod || 'cash', notes: notes || '', location });

    console.log(`📦 New order (fallback): ${order.orderNumber} | ${customerName} | Total: ${total}`);
    res.status(201).json({ data: { orderNumber: order.orderNumber, status: order.status, total: order.total } });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

ordersRouter.get('/:orderNumber/status', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { orderRepository } = await import('../repositories/order.repository');
      const order = await orderRepository.findByOrderNumber(req.params.orderNumber);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.json({ data: { orderNumber: order.orderNumber, status: order.status, paymentStatus: order.paymentStatus, total: order.total, createdAt: order.createdAt } });
    }
    const order = fallbackData.getOrderByNumber(req.params.orderNumber);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ data: { orderNumber: order.orderNumber, status: order.status, paymentStatus: order.paymentStatus, total: order.total, createdAt: order.createdAt } });
  } catch (err) {
    console.error('Order status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

ordersRouter.post('/discounts/validate', async (req: Request, res: Response) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ error: 'Discount code required' });
    if (isDbAvailable()) {
      const { discountRepository } = await import('../repositories/discount.repository');
      const result = await discountRepository.validate(code, orderTotal || 0);
      return res.json({ data: result });
    }
    // Fallback: fake WELCOME10 discount
    if (code.toUpperCase() === 'WELCOME10') {
      const discountAmount = Math.round((orderTotal || 0) * 0.1);
      return res.json({ data: { valid: true, discountAmount, discount: { code: 'WELCOME10', type: 'percentage', value: 10 } } });
    }
    res.json({ data: { valid: false, error: 'Промокод недействителен' } });
  } catch (err) {
    console.error('Validate discount error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
