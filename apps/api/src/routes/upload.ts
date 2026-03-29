import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAdmin } from '../middleware/auth';

export const uploadRouter = Router();

// Ensure upload dirs exist
const uploadDir = path.join(process.cwd(), 'uploads');
const productsDir = path.join(uploadDir, 'products');
const categoriesDir = path.join(uploadDir, 'categories');
[uploadDir, productsDir, categoriesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, productsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// POST /api/upload/product — upload product image
uploadRouter.post('/product', requireAdmin, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/products/${req.file.filename}`;
  res.json({ data: { url, filename: req.file.filename } });
});

// POST /api/upload/products — upload multiple product images
uploadRouter.post('/products', requireAdmin, upload.array('images', 5), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
  const urls = files.map(f => `/uploads/products/${f.filename}`);
  res.json({ data: { urls } });
});

// POST /api/upload/category — upload category image
const catStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, categoriesDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});
const catUpload = multer({ storage: catStorage, limits: { fileSize: 10 * 1024 * 1024 } });

uploadRouter.post('/category', requireAdmin, catUpload.single('image'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/categories/${req.file.filename}`;
  res.json({ data: { url, filename: req.file.filename } });
});

// DELETE /api/upload — delete a file
uploadRouter.delete('/', requireAdmin, (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });
  const filePath = path.join(process.cwd(), url);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ data: { message: 'File deleted' } });
  }
  res.status(404).json({ error: 'File not found' });
});
