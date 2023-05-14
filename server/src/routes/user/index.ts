import { Router } from 'express';
import requireAuth from '../../middleware/requireAuth';
import {GetUserHandler, GetUserWorkspaces} from '../../controllers/user/auth.controller';

import authRouter from './auth';

const router = Router();

router.use('/auth', authRouter);
router.get('/workspaces', requireAuth, GetUserWorkspaces);
router.get('/', requireAuth, GetUserHandler);

export default router;
