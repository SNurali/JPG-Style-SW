import { Router, Request, Response } from 'express';
import { isDbAvailable } from '../main';
import { fallbackData } from '../data/fallback';

export const reviewsRouter = Router();

reviewsRouter.get('/:productId', async (req: Request, res: Response) => {
  try {
    if (isDbAvailable()) {
      const { reviewRepository } = await import('../repositories/review.repository');
      const data = await reviewRepository.findByProduct(req.params.productId);
      return res.json({ data });
    }
    res.json({ data: fallbackData.getReviewsByProduct(req.params.productId) });
  } catch (err) {
    console.error('Reviews error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

reviewsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { productId, customerName, rating, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) return res.status(400).json({ error: 'Missing required fields' });
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    if (isDbAvailable()) {
      const { reviewRepository } = await import('../repositories/review.repository');
      const review = await reviewRepository.create({ productId, customerName, rating, comment });
      return res.status(201).json({ data: { message: 'Review submitted for approval', review } });
    }
    res.status(201).json({ data: { message: 'Review submitted (fallback mode)' } });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
