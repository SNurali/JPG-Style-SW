import { Router, Request, Response } from 'express';
import { isDbAvailable } from '../main';
import { fallbackData } from '../data/fallback';

export const productsRouter = Router();

productsRouter.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { productRepository } = await import('../repositories/product.repository');
      const result = await productRepository.findAll({
        category: req.query.category as string,
        search: req.query.search as string,
        bestsellers: req.query.bestsellers === 'true',
        isNew: req.query.new === 'true',
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      });
      return res.json(result);
    }
    // Fallback
    const result = fallbackData.getProducts({
      category: req.query.category,
      search: req.query.search,
      bestsellers: req.query.bestsellers === 'true',
      isNew: req.query.new === 'true',
    });
    res.json(result);
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

productsRouter.get('/bestsellers', async (_req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { productRepository } = await import('../repositories/product.repository');
      const data = await productRepository.findBestsellers();
      return res.json({ data });
    }
    res.json({ data: fallbackData.getBestsellers() });
  } catch (err) {
    console.error('Bestsellers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

productsRouter.get('/new', async (_req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { productRepository } = await import('../repositories/product.repository');
      const data = await productRepository.findNew();
      return res.json({ data });
    }
    res.json({ data: fallbackData.getNewProducts() });
  } catch (err) {
    console.error('New products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

productsRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { productRepository } = await import('../repositories/product.repository');
      const product = await productRepository.findBySlug(req.params.slug);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.json({ data: product });
    }
    const product = fallbackData.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: product });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
