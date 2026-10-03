import { Router } from 'express';
import { googleAuth, getMe, logout } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.post('/google', googleAuth);
router.get('/me', authenticateUser, getMe);
router.post('/logout', logout);

export default router;
