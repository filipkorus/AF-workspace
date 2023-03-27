import {Router} from 'express';
import {LoginHandler, LogoutHandler, RefreshTokenHandler} from '../../../controllers/user/auth.controller';
import requireAuth from '../../../middleware/requireAuth';

const router = Router();

router.post('/login', LoginHandler);
router.post('/refresh', RefreshTokenHandler);

router.get('/logout', requireAuth, LogoutHandler);

export default router;
