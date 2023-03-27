import { Router } from 'express';
import userRouter from './user';
import {SUCCESS} from '../helpers/responses/messages';

const router = Router();

router.use('/user', userRouter);

router.get('/', (req, res) => SUCCESS(res, {apiVersion: 1.0}));

export default router;
