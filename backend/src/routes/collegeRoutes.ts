import { Router } from 'express';
import {
  getColleges,
  getCollegeById,
  searchColleges,
  getManagementTypes
} from '../controllers/collegeController.js';

const router = Router();

// Routes
router.get('/search', searchColleges);
router.get('/management-types', getManagementTypes);
router.get('/', getColleges);
router.get('/:id', getCollegeById);

export default router;
