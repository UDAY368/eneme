import { Router } from 'express';
import { trackVisit } from '../controllers/visitController';

const router = Router();
// Public - called from frontend to track page visits
router.post('/', trackVisit);
export default router;
