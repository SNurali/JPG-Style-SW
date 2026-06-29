import { Router, Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';
import { isDbAvailable } from '../main';
import { generateCustomerToken, requireCustomer } from '../middleware/auth';

export const authRouter = Router();

const RegisterSchema = z.object({
  name: z.string().min(2, 'Имя минимум 2 символа'),
  email: z.string().email('Некорректный email'),
  phone: z.string().min(7, 'Некорректный телефон').optional().or(z.literal('')),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
});

const LoginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

const ProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(7).optional().or(z.literal('')),
});

function publicCustomer(c: any) {
  return { id: c.id, name: c.name, email: c.email, phone: c.phone, googleLinked: c.googleLinked, hasPassword: c.hasPassword };
}

function dbGuard(res: Response): boolean {
  if (!isDbAvailable()) {
    res.status(503).json({ error: 'Сервис временно недоступен (нет БД)' });
    return false;
  }
  return true;
}

// ─── Register ───────────────────────────────────────────
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    if (!dbGuard(res)) return;
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const { name, email, phone, password } = parsed.data;

    const { customerRepository } = await import('../repositories/customer.repository');
    if (await customerRepository.findByEmail(email)) {
      return res.status(409).json({ error: 'Этот email уже зарегистрирован' });
    }
    if (phone && (await customerRepository.findByPhone(phone))) {
      return res.status(409).json({ error: 'Этот телефон уже используется' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await customerRepository.createWithPassword({ name, email, phone: phone || undefined, passwordHash });
    const token = generateCustomerToken({ id: customer.id, email: customer.email, name: customer.name, type: 'customer' });
    res.status(201).json({ data: { token, user: publicCustomer(customer) } });
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email или телефон уже заняты' });
    console.error('Register error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ─── Login ──────────────────────────────────────────────
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    if (!dbGuard(res)) return;
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const { email, password } = parsed.data;

    const { customerRepository } = await import('../repositories/customer.repository');
    const row = await customerRepository.findByEmail(email);
    if (!row || !row.password_hash) return res.status(401).json({ error: 'Неверный email или пароль' });
    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) return res.status(401).json({ error: 'Неверный email или пароль' });

    const customer = await customerRepository.findById(row.id);
    const token = generateCustomerToken({ id: customer!.id, email: customer!.email, name: customer!.name, type: 'customer' });
    res.json({ data: { token, user: publicCustomer(customer) } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ─── Google OAuth (verify ID token via Google tokeninfo) ─
authRouter.post('/google', async (req: Request, res: Response) => {
  try {
    if (!dbGuard(res)) return;
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken обязателен' });

    const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!resp.ok) return res.status(401).json({ error: 'Google-токен недействителен' });
    const info: any = await resp.json();

    const expectedAud = process.env.GOOGLE_CLIENT_ID;
    if (expectedAud && info.aud !== expectedAud) {
      return res.status(401).json({ error: 'Google-токен выписан для другого приложения' });
    }
    if (!info.sub) return res.status(401).json({ error: 'Некорректный Google-профиль' });

    const { customerRepository } = await import('../repositories/customer.repository');
    const customer = await customerRepository.upsertGoogle({
      googleId: info.sub,
      email: info.email || '',
      name: info.name || info.email || 'Клиент',
    });
    const token = generateCustomerToken({ id: customer.id, email: customer.email, name: customer.name, type: 'customer' });
    res.json({ data: { token, user: publicCustomer(customer) } });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Не удалось войти через Google' });
  }
});

// ─── Current profile ────────────────────────────────────
authRouter.get('/me', requireCustomer, async (req: Request, res: Response) => {
  try {
    if (!dbGuard(res)) return;
    const { customerRepository } = await import('../repositories/customer.repository');
    const customer = await customerRepository.findById(req.customer!.id);
    if (!customer) return res.status(404).json({ error: 'Профиль не найден' });
    res.json({ data: publicCustomer(customer) });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ─── Update profile ─────────────────────────────────────
authRouter.patch('/profile', requireCustomer, async (req: Request, res: Response) => {
  try {
    if (!dbGuard(res)) return;
    const parsed = ProfileSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const { customerRepository } = await import('../repositories/customer.repository');
    const customer = await customerRepository.updateProfile(req.customer!.id, parsed.data);
    res.json({ data: publicCustomer(customer) });
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'Этот телефон уже используется' });
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ─── Order history ──────────────────────────────────────
authRouter.get('/orders', requireCustomer, async (req: Request, res: Response) => {
  try {
    if (!dbGuard(res)) return;
    const { customerRepository } = await import('../repositories/customer.repository');
    const orders = await customerRepository.findOrders(req.customer!.id);
    res.json({ data: orders });
  } catch (err) {
    console.error('Customer orders error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});
