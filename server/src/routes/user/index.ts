import { Router } from 'express';
import requireAuth from '../../middleware/requireAuth';
import {GetUserHandler} from '../../controllers/user/auth.controller';

import authRouter from './auth';

const router = Router();

router.use('/auth', authRouter);
router.get('/', requireAuth, GetUserHandler);

export default router;
