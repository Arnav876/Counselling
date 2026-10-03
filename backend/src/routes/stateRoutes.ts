import { Router } from 'express';
import { getStates } from '../controllers/stateController.js';

const router = Router();

router.get('/', getStates);

export default router;
