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

/**
 * @return Array of all workspaces that given user is an owner or a member of.
 * @param userId ID of a user.
 */
export const getAllWorkspacesByUserId = async (userId: string) => {
	try {
		return await Workspace.find({$or: [
			{createdBy: userId},
			{members: {$elemMatch:{userId:{$in:[userId]}}}}
		]}, {content: 0, __v: 0, members: 0, messages: 0, sharedFiles: 0, todos: 0});
	} catch (error) {
		logError(error);
		return [];
	}
};

/**
 * Adds new member to a workspace.
 * @param workspaceId ID of workspace.
 * @param memberId ID of user to be added as a member.
 * @param addedByUserId ID of user adding new user as a member.
 */
export const addMemberToWorkspace = async (workspaceId: string, memberId: string, addedByUserId: string) => {
	try {
		await Workspace.findOneAndUpdate({_id: workspaceId}, {
			$push: {
				members: {
					userId: memberId,
					addedBy: addedByUserId
				}
			}
		});
	} catch (error) {
		logError(error);
	}
};
