import config from 'config';
import Workspace, {IWorkspaceMessage} from '../../models/workspace';
import {logError} from '../../utils/logger';
import {regexLatitude} from '../../helpers/validation/regexes';
import {isUserMemberOrCreatorOfWorkspace} from './document.service';

/**
 * Adds new message to a workspace.
 * @param workspaceId ID of workspace.
 * @param userId ID of user who sent a message.
 * @param content Content of the message.
 */
export const saveMessage = async (workspaceId: string, userId: string, content: string) => {
	try {
		await Workspace.findOneAndUpdate({_id: workspaceId}, {
			$push: {
				messages: {
					userId,
					content
				}
			}
		});
	} catch (error) {
		logError(error);
	}
};

export const getMessages = async (workspaceId: string, userId: string, n: number=null) => {
	try {
		if (workspaceId == null) return null;

		const workspace = (n == null ?
			await Workspace.findById(workspaceId, {_id: 0, createdAt: 0, content: 0, __v: 0, sharedFiles: 0, todos: 0}).populate({
				path: 'messages.userId',
				select: 'name picture'
			}) :
			await Workspace.findById(workspaceId, {_id: 0, createdAt: 0, content: 0, __v: 0, sharedFiles: 0, todos: 0}).limit(n).populate({
				path: 'messages.userId',
				select: 'name picture'
			})
		);

		if (await isUserMemberOrCreatorOfWorkspace(workspaceId, userId)) {
			return workspace.messages.map((message: any) => {
				const {userId: author, content, createdAt, _id} = message;
				return {
					content, createdAt, _id,
					author
				} as IWorkspaceMessage;
			});
		}

		return null;
	} catch (error) {
		logError(error);
		return null;
	}
};

