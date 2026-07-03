import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/perfil', authMiddleware, getProfile);
router.put('/perfil', authMiddleware, updateProfile);

export default router;