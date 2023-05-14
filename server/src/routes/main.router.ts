import { Router } from 'express';
import userRouter from './user';
import workspaceRouter from './workspace';
import {SUCCESS} from '../helpers/responses/messages';

const router = Router();

router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);

router.get('/', (req, res) => SUCCESS(res, {apiVersion: 1.0}));

export default router;
