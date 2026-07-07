import { Router } from 'express';
import { getSettings, updateSettings, resetSettings } from './settings.controller.js';
import authenticate from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/reset', resetSettings);

export default router;
