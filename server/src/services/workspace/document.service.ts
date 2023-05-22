import config from 'config';
import Workspace from '../../models/workspace';
import {logError} from '../../utils/logger';
import {getSharedFiles, removeSharedFile} from './sharedFile.service';

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
			return await Workspace.create({ _id: workspaceId, content: config.get<string>('QUILL_DOCUMENT_DEFAULT_VALUE'), name: workspaceId, createdBy: userId });
		}

		if (await isUserMemberOrCreatorOfWorkspace(workspaceId, userId)) {
			return workspace;
		}

		return;
	} catch (error) {
		logError(error);
		return;
	}
}

export const findWorkspaceByIdAndUpdateContent = async (workspaceId: string, data) => {
	try {
		await Workspace.findByIdAndUpdate(workspaceId, {content: data});
	} catch (error) {
		logError(error);
	}
}

export const findWorkspaceByIdAndUpdateName = async (workspaceId: string, name: string) => {
	try {
		await Workspace.findByIdAndUpdate(workspaceId, {name});
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
		]}, {content: 0, __v: 0, members: 0, messages: 0, AIChat: 0, sharedFiles: 0, todos: 0});
	} catch (error) {
		logError(error);
		return [];
	}
};

/**
 * @return Workspace object.
 * @param workspaceId ID of a workspace.
 */
export const getWorkspaceById = async (workspaceId: string) => {
	try {
		return await Workspace.findById(workspaceId, {__v: 0, messages: 0, AIChat: 0, todos: 0});
	} catch (error) {
		logError(error);
		return null;
	}
};

/**
 * @param workspaceId ID of workspace to delete.
 * @param userId ID of a user.
 */
export const deleteWorkspaceById = async (workspaceId: string, userId: string) => {
	try {
		const sharedFiles = await getSharedFiles(workspaceId, userId);

		for (const sharedFile of sharedFiles) {
			await removeSharedFile({
				workspaceId,
				uniqueFilename: sharedFile.uniqueFilename
			});
		}

		await Workspace.deleteOne({$and: [
			{_id: workspaceId},
			{createdBy: userId}
		]}, {content: 0, __v: 0, members: 0, messages: 0, AIChat: 0, sharedFiles: 0, todos: 0});
	} catch (error) {
		logError(error);
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

/**
 * Removes a member from a workspace.
 * @param workspaceId ID of workspace.
 * @param memberIdToRemove ID of user whose membership to remove.
 */
export const removeMemberFromWorkspace = async (workspaceId: string, memberIdToRemove: string) => {
	try {
		await Workspace.findOneAndUpdate({_id: workspaceId}, {
			$pull:{members: {userId: memberIdToRemove}}
		});
	} catch (error) {
		logError(error);
	}
};

/**
 * Checks if user is a creator or a member of a workspace.
 * @param workspaceId ID of workspace to be checked.
 * @param userId ID of user to be checked.
 */
export const isUserMemberOrCreatorOfWorkspace = async (workspaceId: string, userId: string): Promise<boolean | null> => {
	const workspace = await getWorkspaceById(workspaceId);

	if (workspace == null) {
		return null;
	}

	return workspace.createdBy === userId || workspace.members.map(member => member.userId).includes(userId);
};

