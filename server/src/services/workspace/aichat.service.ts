import config from 'config';
import Workspace, {IWorkspaceMessage} from '../../models/workspace';
import {logError} from '../../utils/logger';
import {isUserMemberOrCreatorOfWorkspace} from './document.service';
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({ apiKey: config.get<string>('OPENAI_API_KEY') });
const openai = new OpenAIApi(configuration);

export const createChatCompletion = async ({messages}: {
	messages: {
		role: 'user' | 'assistant',
		content: string
	}[]
}) => {
	try {
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: messages,
		});

		return completion.data.choices[0].message.content;

	} catch (error) {
		if (error?.response) {
			logError(error.response?.status);
			logError(error.response?.data);
		} else {
			logError(error?.message);
		}

		return null;
	}
};

/**
 * Adds new message to a workspace.
 * @param workspaceId ID of workspace.
 * @param userId ID of user who sent a message.
 * @param content Content of the message.
 * @param role 'user' if message was sent by user or 'assistant' if message was sent by openai
 */
export const saveMessage = async ({workspaceId, content, role, userId}: {
	workspaceId: string,
	content: string,
	userId?: string,
	role: 'user' | 'assistant'
}) => {
	try {
		if (role === 'assistant') {
			await Workspace.findOneAndUpdate({_id: workspaceId}, {
				$push: {
					AIChat: {
						content,
						role
					}
				}
			});
			return;
		}

		if (userId == null) return;

		await Workspace.findOneAndUpdate({_id: workspaceId}, {
			$push: {
				AIChat: {
					content,
					role,
					addedBy: userId
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

