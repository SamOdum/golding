import { Router } from 'express';
import { login, register, getCurrentUser, logout } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/protected', authenticateToken, getCurrentUser);

export default router;