import { Router } from 'express';
import { createContact, getMyContacts } from '../controllers/contactController.js';
import { optionalAuth, authenticateUser } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, createContact);
router.get('/my', authenticateUser, getMyContacts);

export default router;
