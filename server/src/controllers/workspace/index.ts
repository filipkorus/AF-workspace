import {BAD_REQUEST, FORBIDDEN, SUCCESS} from '../../helpers/responses/messages';
import {
	deleteWorkspaceById, findWorkspaceByIdAndUpdateName,
	getAllWorkspacesByUserId,
	getWorkspaceById
} from '../../services/workspace/document.service';
import exp from 'constants';

export const GetUserWorkspacesHandler = async (req, res) => {
	return SUCCESS(res, {workspaces: await getAllWorkspacesByUserId(res.locals.user.id)});
};

export const DeleteWorkspaceHandler = async (req, res) => {
	const {id: workspaceIdToDelete} = req.params;

	if (workspaceIdToDelete == null) {
		return BAD_REQUEST(res);
	}

	await deleteWorkspaceById(workspaceIdToDelete, res.locals.user.id);

	return SUCCESS(res);
};

export const RenameWorkspaceHandler = async (req, res) => {
	const {name} = req.body;
	const {id: workspaceId} = req.params;

	if (name == null || workspaceId == null) {
		return BAD_REQUEST(res);
	}

	const workspace = await getWorkspaceById(workspaceId);

	if (workspace == null) {
		return BAD_REQUEST(res);
	}

	if (!(workspace.createdBy === res.locals.user.id || workspace.members.map(member => member.userId).includes(res.locals.user.id))) {
		return FORBIDDEN(res);
	}

	await findWorkspaceByIdAndUpdateName(workspaceId, name);
	return SUCCESS(res);
};
