import { Router } from 'express';
import {
  getMyConversations,
  getMyConversationById,
  createConversation,
  deleteMyConversation
} from '../controllers/conversationController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.get('/', getMyConversations);
router.post('/', createConversation);
router.get('/:id', getMyConversationById);
router.delete('/:id', deleteMyConversation);

export default router;
