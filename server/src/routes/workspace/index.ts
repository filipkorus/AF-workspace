import requireAuth from '../../middleware/requireAuth';
import {GetUserWorkspaces} from '../../controllers/workspace';
import {Router} from 'express';

const router = Router();

router.get('/', requireAuth, GetUserWorkspaces);

export default router;
