import { Router } from 'express';
import { getFeed, createPublication } from '../controllers/postController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validatePost } from '../middlewares/validationMiddleware.js';

const router = Router();

router.get('/', getFeed); // pública
router.post('/', authMiddleware, validatePost, createPublication); // protegida

export default router;