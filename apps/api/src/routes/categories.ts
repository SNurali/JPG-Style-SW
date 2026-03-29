import { Router, Request, Response } from 'express';
import { isDbAvailable } from '../main';
import { fallbackData } from '../data/fallback';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { categoryRepository } = await import('../repositories/category.repository');
      const data = await categoryRepository.findAll();
      return res.json({ data });
    }
    res.json({ data: fallbackData.getCategories() });
  } catch (err) {
    console.error('Categories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

categoriesRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { categoryRepository } = await import('../repositories/category.repository');
      const { productRepository } = await import('../repositories/product.repository');
      const category = await categoryRepository.findBySlug(req.params.slug);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      const products = await productRepository.findAll({ category: req.params.slug, limit: 50 });
      return res.json({ data: { ...category, products: products.data } });
    }
    const category = fallbackData.getCategoryBySlug(req.params.slug);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    const products = fallbackData.getProducts({ category: req.params.slug });
    res.json({ data: { ...category, products: products.data } });
  } catch (err) {
    console.error('Category detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
