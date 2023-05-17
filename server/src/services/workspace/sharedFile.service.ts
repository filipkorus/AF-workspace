import Workspace, {IWorkspaceSharedFile} from '../../models/workspace';
import {logError} from '../../utils/logger';
import {getWorkspaceById, isUserMemberOrCreatorOfWorkspace} from './document.service';
import path from 'path';
import fs from 'fs';
import config from 'config';

/**
 * Adds uploaded file to a workspace.
 * @param workspaceId ID of workspace.
 * @param addedBy ID of user who uploaded a file.
 * @param originalFilename Original filename of file that user uploaded.
 * @param uniqueFilename Unique filename (with extension).
 */
export const saveSharedFile = async ({workspaceId, addedBy, originalFilename, uniqueFilename}: {
	workspaceId: string,
	addedBy: string,
	originalFilename: string,
	uniqueFilename: string
}) => {
	if (!(await isUserMemberOrCreatorOfWorkspace(workspaceId, addedBy))) return;

	try {
		await Workspace.findOneAndUpdate({_id: workspaceId}, {
			$push: {
				sharedFiles: {
					originalFilename,
					uniqueFilename,
					addedBy
				}
			}
		});
	} catch (error) {
		logError(error);
	}
};

/**
 * Removes file record from the database and the actual file from File System.
 * @param workspaceId ID of workspace.
 * @param uniqueFilename Unique filename (with extension).
 */
export const removeSharedFile = async ({workspaceId, uniqueFilename}: {
	workspaceId: string,
	uniqueFilename: string
}) => {
	if (workspaceId == null) return null;

	try {
		await Workspace.findOneAndUpdate({_id: workspaceId}, {
			$pull:{sharedFiles:{uniqueFilename}}
		});
	} catch (error) {
		logError(error);
	}

	const pathToFile = path.join(config.get<string>('WORKSPACE_SHARED_FILES_DIR'), uniqueFilename);
	if (fs.existsSync(pathToFile)) {
		fs.unlink(pathToFile, () => {});
	}
};

export const getSharedFiles = async (workspaceId: string, userId: string, n: number=null) => {
	if (workspaceId == null) return null;

	try {
		const workspace = (n == null ?
				await Workspace.findById(workspaceId, {_id: 0, createdAt: 0, content: 0, __v: 0, messages: 0, todos: 0}).populate({
					path: 'sharedFiles.addedBy',
					select: 'name picture'
				}) :
				await Workspace.findById(workspaceId, {_id: 0, createdAt: 0, content: 0, __v: 0, messages: 0, todos: 0}).limit(n).populate({
					path: 'sharedFiles.addedBy',
					select: 'name picture'
				})
		);

		if (await isUserMemberOrCreatorOfWorkspace(workspaceId, userId)) {
			return workspace.sharedFiles;
		}

		return null;
	} catch (error) {
		logError(error);
		return null;
	}
};

export const getSharedFileByUniqueFilename = async (workspaceId: string, uniqueFilename: string) => {
	if (workspaceId == null) return null;

	try {
		const workspace = await getWorkspaceById(workspaceId);

		return workspace.sharedFiles.find((sharedFile: IWorkspaceSharedFile) => sharedFile.uniqueFilename === uniqueFilename);
	} catch (error) {
		logError(error);
		return null;
	}
};

