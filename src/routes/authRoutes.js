import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middlewares/validationMiddleware.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;