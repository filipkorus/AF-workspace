import {BAD_REQUEST, CONFLICT, FORBIDDEN, NOT_FOUND, RESPONSE, SUCCESS} from '../../helpers/responses/messages';
import {
	addMemberToWorkspace,
	deleteWorkspaceById, findWorkspaceByIdAndUpdateName,
	getAllWorkspacesByUserId,
	isUserMemberOrCreatorOfWorkspace, removeMemberFromWorkspace
} from '../../services/workspace/document.service';
import {getUserByEmail} from '../../services/user/auth.service';
import path from 'path';
import config from 'config';
import * as fs from 'fs';
import {
	getSharedFileByUniqueFilename,
	getSharedFiles,
	removeSharedFile
} from '../../services/workspace/sharedFile.service';
import {IWorkspaceSharedFile} from '../../models/workspace';

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

	const isUserPermitted = await isUserMemberOrCreatorOfWorkspace(workspaceId, res.locals.user.id);

	if (isUserPermitted == null) {
		return BAD_REQUEST(res);
	}

	if (!isUserPermitted) {
		return FORBIDDEN(res);
	}

	await findWorkspaceByIdAndUpdateName(workspaceId, name);
	return SUCCESS(res);
};

export const AddWorkspaceMemberHandler = async (req, res) => {
	const {email} = req.body;
	const {id: workspaceId} = req.params;

	if (email == null || workspaceId == null) {
		return BAD_REQUEST(res);
	}

	const isUserPermitted = await isUserMemberOrCreatorOfWorkspace(workspaceId, res.locals.user.id);

	if (isUserPermitted == null) {
		return FORBIDDEN(res);
	}

	if (!isUserPermitted) {
		return FORBIDDEN(res);
	}

	const userToBeAdded = await getUserByEmail(email);
	if (userToBeAdded == null) {
		return NOT_FOUND(res);
	}

	if (await isUserMemberOrCreatorOfWorkspace(workspaceId, userToBeAdded._id.toString())) {
		return CONFLICT(res);
	}

	await addMemberToWorkspace(workspaceId, userToBeAdded._id, res.locals.user.id);
	return RESPONSE(res, 'User has been added', 201);
};

export const RemoveWorkspaceMemberHandler = async (req, res) => {
	const {id: workspaceId, email} = req.params;

	if (email == null || workspaceId == null) {
		return BAD_REQUEST(res);
	}

	const isUserPermitted = await isUserMemberOrCreatorOfWorkspace(workspaceId, res.locals.user.id);

	if (isUserPermitted == null) {
		return FORBIDDEN(res);
	}

	if (!isUserPermitted) {
		return FORBIDDEN(res);
	}

	const userToBeRemoved = await getUserByEmail(email);
	if (userToBeRemoved == null) {
		return NOT_FOUND(res);
	}

	if (!(await isUserMemberOrCreatorOfWorkspace(workspaceId, userToBeRemoved._id.toString()))) {
		return CONFLICT(res);
	}

	await removeMemberFromWorkspace(workspaceId, userToBeRemoved._id);
	return SUCCESS(res);
};

export const GetSharedFileByUniqueNameHandler = async (req, res) => {
	const {id: workspaceId, uniqueFilename} = req.params;

	if (uniqueFilename == null || workspaceId == null) {
		return BAD_REQUEST(res);
	}

	const isUserPermitted = await isUserMemberOrCreatorOfWorkspace(workspaceId, res.locals.user.id);

	if (isUserPermitted == null) {
		return FORBIDDEN(res);
	}

	if (!isUserPermitted) {
		return FORBIDDEN(res);
	}

	const pathToFile = path.join(config.get<string>('WORKSPACE_SHARED_FILES_DIR'), uniqueFilename);

	if (!fs.existsSync(pathToFile)) {
		return NOT_FOUND(res);
	}

	return res.download(pathToFile);
};

export const GetSharedFilesHandler = async (req, res) => {
	const {id: workspaceId} = req.params;

	if (workspaceId == null) {
		return BAD_REQUEST(res);
	}

	const isUserPermitted = await isUserMemberOrCreatorOfWorkspace(workspaceId, res.locals.user.id);

	if (isUserPermitted == null) {
		return FORBIDDEN(res);
	}

	if (!isUserPermitted) {
		return FORBIDDEN(res);
	}

	const _sharedFilesFromDB = await getSharedFiles(workspaceId, res.locals.user.id);

	const sharedFiles: IWorkspaceSharedFile[] = [];

	_sharedFilesFromDB.reverse().forEach((sharedFile: IWorkspaceSharedFile) => {
		const pathToFile = path.join(config.get<string>('WORKSPACE_SHARED_FILES_DIR'), sharedFile.uniqueFilename);
		if (fs.existsSync(pathToFile)) {
			sharedFiles.push(sharedFile);
		}
	});

	return SUCCESS(res, {
		sharedFiles
	});
};

export const DeleteSharedFileByUniqueNameHandler = async (req, res) => {
	const {id: workspaceId, uniqueFilename} = req.params;

	if (workspaceId == null || uniqueFilename == null) {
		return BAD_REQUEST(res);
	}

	const isUserPermitted = await isUserMemberOrCreatorOfWorkspace(workspaceId, res.locals.user.id);

	if (isUserPermitted == null) {
		return FORBIDDEN(res);
	}

	if (!isUserPermitted) {
		return FORBIDDEN(res);
	}

	await removeSharedFile({workspaceId, uniqueFilename});

	return SUCCESS(res);
};
