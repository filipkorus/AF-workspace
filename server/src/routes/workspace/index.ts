import {
	AddWorkspaceMemberHandler,
	DeleteWorkspaceHandler, GetSharedFileByUniqueNameHandler, GetSharedFilesHandler,
	GetUserWorkspacesHandler, RemoveWorkspaceMemberHandler, DeleteSharedFileByUniqueNameHandler,
	RenameWorkspaceHandler, GetWorkspaceHandler
} from '../../controllers/workspace';
import {Router} from 'express';

const router = Router();

/* middleware requireAuth has been applied earlier, so it is not necessary here */

router.get('/', GetUserWorkspacesHandler);

router.get('/:id', GetWorkspaceHandler);
router.delete('/:id', DeleteWorkspaceHandler);
router.put('/:id', RenameWorkspaceHandler);

router.post('/:id/member', AddWorkspaceMemberHandler);
router.delete('/:id/member/:email', RemoveWorkspaceMemberHandler);

router.get('/:id/sharedFile', GetSharedFilesHandler);
router.get('/:id/sharedFile/:uniqueFilename', GetSharedFileByUniqueNameHandler);
router.delete('/:id/sharedFile/:uniqueFilename', DeleteSharedFileByUniqueNameHandler);

export default router;
