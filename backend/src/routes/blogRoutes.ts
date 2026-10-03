import { Router } from 'express';
import {
  getPublicBlogs,
  getPublicBlogBySlug,
  getBlogCategoryStats
} from '../controllers/blogController.js';

const router = Router();

router.get('/', getPublicBlogs);
router.get('/categories', getBlogCategoryStats);
router.get('/category/:category', (req, res, next) => {
  req.query.category = req.params.category.toUpperCase();
  getPublicBlogs(req, res).catch(next);
});
router.get('/:slug', getPublicBlogBySlug);

export default router;
