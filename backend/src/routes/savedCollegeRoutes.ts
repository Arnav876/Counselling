import { Router } from 'express';
import {
  getSavedColleges,
  getSavedCollegeIds,
  saveCollege,
  unsaveCollege
} from '../controllers/savedCollegeController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.get('/ids', getSavedCollegeIds);
router.get('/', getSavedColleges);
router.post('/:collegeId', saveCollege);
router.delete('/:collegeId', unsaveCollege);

export default router;
