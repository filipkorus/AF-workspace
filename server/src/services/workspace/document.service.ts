import config from 'config';
import Workspace from '../../models/workspace';
import {logError} from '../../utils/logger';

/**
 * Finds existing or creates new workspace in DB.
 *
 * @param workspaceId {string} ID of workspace.
 * @param userId {string} ID of user who creates workspace.
 */
export const findOrCreateWorkspace = async (workspaceId: string, userId: string) => {
	if (workspaceId == null) return;

	try {
		const workspace = await Workspace.findById(workspaceId);
		if (workspace == null) {
			return await Workspace.create({ _id: workspaceId, content: config.get<string>('QUILL_DOCUMENT_DEFAULT_VALUE'), createdBy: userId });
		}

		if (workspace.createdBy === userId || workspace.members.map(member => member.userId).includes(userId)) {
			return workspace;
		}
		return;
	} catch (error) {
		logError(error);
		return;
	}
}

export const findWorkspaceByIdAndUpdate = async (workspaceId: string, data) => {
	try {
		await Workspace.findByIdAndUpdate(workspaceId, {content: data});
	} catch (error) {
		logError(error);
	}
}
