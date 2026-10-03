import { Router } from 'express';
import { handleChat } from '../controllers/chatController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, handleChat);

export default router;
