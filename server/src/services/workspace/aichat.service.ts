import config from 'config';
import Workspace, {IWorkspaceAIChat} from '../../models/workspace';
import {logError} from '../../utils/logger';
import {isUserMemberOrCreatorOfWorkspace} from './document.service';
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({ apiKey: config.get<string>('OPENAI_API_KEY') });
const openai = new OpenAIApi(configuration);

export const createAIChatCompletion = async (messages: {
	role: 'user' | 'assistant',
	content: string
}[]) => {
	try {
		const completion = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages
		});

		return completion.data.choices[0].message.content;

	} catch (error) {
		logError('OpenAI API error');
		if (error?.response) {
			console.log(error.response?.data);
		} else {
			logError(error?.message);
		}

		return null;
	}
};

/**
 * Adds new AI Chat message to a workspace.
 * @param workspaceId ID of workspace.
 * @param userId ID of user who sent a message.
 * @param content Content of the message.
 * @param role 'user' if message was sent by user or 'assistant' if message was sent by openai
 */
export const saveAIChatMessage = async ({workspaceId, content, role, userId}: {
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

/**
 * Removes all AI Chat messages from a workspace.
 * @param workspaceId ID of workspace
 */
export const removeAIChatMessages = async (workspaceId: string) => {
	try {
		await Workspace.findOneAndUpdate({ _id: workspaceId }, { $set: { AIChat: [] } });
	} catch (error) {
		logError(error);
	}
};

export const getAIChatMessages = async (workspaceId: string, n: number=null) => {
	try {
		if (workspaceId == null) return null;

		const workspace = (n == null ?
			await Workspace.findById(workspaceId, {_id: 0, createdAt: 0, content: 0, __v: 0, messages: 0, members: 0, sharedFiles: 0, todos: 0}).populate({
				path: 'AIChat.addedBy',
				select: 'name picture'
			}) :
			await Workspace.findById(workspaceId, {_id: 0, createdAt: 0, content: 0, __v: 0, messages: 0, members: 0, sharedFiles: 0, todos: 0}).limit(n).populate({
				path: 'AIChat.addedBy',
				select: 'name picture'
			})
		);

		return workspace.AIChat.map((message: any) => {
			const {addedBy: author, content, role, addedAt, _id} = message;
			return {
				content, addedAt, _id,
				author, role
			} as IWorkspaceAIChat;
		});
	} catch (error) {
		logError(error);
		return null;
	}
};

