import {
	AddWorkspaceMemberHandler,
	DeleteWorkspaceHandler,
	GetUserWorkspacesHandler, RemoveWorkspaceMemberHandler,
	RenameWorkspaceHandler
} from '../../controllers/workspace';
import {Router} from 'express';

const router = Router();

/* middleware requireAuth has been applied earlier, so it is not necessary here */

router.get('/', GetUserWorkspacesHandler);

router.delete('/:id', DeleteWorkspaceHandler);
router.put('/:id', RenameWorkspaceHandler);
router.post('/:id/member', AddWorkspaceMemberHandler);

router.delete('/:id/member/:email', RemoveWorkspaceMemberHandler);

export default router;
