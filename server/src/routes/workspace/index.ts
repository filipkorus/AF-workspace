import requireAuth from '../../middleware/requireAuth';
import {DeleteWorkspaceHandler, GetUserWorkspacesHandler, RenameWorkspaceHandler} from '../../controllers/workspace';
import {Router} from 'express';

const router = Router();

router.get('/', requireAuth, GetUserWorkspacesHandler);
router.delete('/:id', requireAuth, DeleteWorkspaceHandler);
router.put('/:id', requireAuth, RenameWorkspaceHandler);

export default router;
