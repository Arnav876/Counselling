import { Router } from 'express';
import { createEnquiry, getMyEnquiries } from '../controllers/enquiryController.js';
import { optionalAuth, authenticateUser } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, createEnquiry);
router.get('/my', authenticateUser, getMyEnquiries);

export default router;
