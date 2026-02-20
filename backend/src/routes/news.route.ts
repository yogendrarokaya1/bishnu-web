import { Router } from 'express';
import newsController from '../controllers/news.controller';

const router = Router();

router.get('/',           newsController.getAll.bind(newsController));
router.get('/featured',   newsController.getFeatured.bind(newsController));
router.get('/breaking',   newsController.getBreaking.bind(newsController));
router.get('/latest',     newsController.getLatest.bind(newsController));
router.get('/:slug',      newsController.getBySlug.bind(newsController));

export default router;
