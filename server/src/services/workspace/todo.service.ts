import Workspace, {IWorkspaceSharedFile} from '../../models/workspace';
import {logError} from '../../utils/logger';
import {getWorkspaceById, isUserMemberOrCreatorOfWorkspace} from './document.service';
import path from 'path';
import fs from 'fs';
import config from 'config';

/**
 * Adds ToDo to the database.
 * @return Saved ToDo object.
 * @param workspaceId ID of workspace.
 * @param content Content of ToDo.
 * @param addedBy ID of user who added a ToDo.
 */
export const saveToDo = async ({workspaceId, content, addedBy}: {
	workspaceId: string,
	content: string,
	addedBy: string
}) => {
	if (!(await isUserMemberOrCreatorOfWorkspace(workspaceId, addedBy))) return null;

	try {
		const workspace = await Workspace.findOneAndUpdate({_id: workspaceId}, {
			$push: {
				todos: {
					content,
					addedBy
				}
			}
		}, { new: true });

		return workspace?.todos[workspace.todos.length - 1] || null;
	} catch (error) {
		logError(error);
		return null;
	}
};

/**
 * Removes ToDo from the database.
 * @param workspaceId ID of workspace.
 * @param todoId ID of a ToDo to remove.
 */
export const deleteToDo = async ({workspaceId, todoId}: {
	workspaceId: string,
	todoId: string
}) => {
	if (workspaceId == null) return null;

	try {
		await Workspace.findOneAndUpdate({_id: workspaceId}, {
			$pull:{todos:{_id:todoId}}
		});
	} catch (error) {
		logError(error);
	}
};

/**
 * Marks ToDo as done or undone.
 * @param workspaceId ID of workspace.
 * @param todoId ID of a ToDo to mark.
 * @param isDone Set to `true` marks as done and otherwise (default is `true`).
 */
export const markToDoAsDoneOrUndone = async ({workspaceId, todoId, isDone=true}: {
	workspaceId: string,
	todoId: string,
	isDone?: boolean
}) => {
	if (workspaceId == null) return null;

	try {
		await Workspace.findOneAndUpdate({_id: workspaceId, 'todos._id': todoId}, {
			$set:{'todos.$.isDone': isDone}
		});
	} catch (error) {
		logError(error);
	}
};

/**
 *
 * @param workspaceId workspaceId ID of workspace.
 * @param n Number of ToDos to return (optional).
 */
export const getToDos = async (workspaceId: string, n: number=null) => {
	if (workspaceId == null) return null;

	try {
		const workspace = (n == null ?
				await Workspace.findById(workspaceId, {_id: 0, createdAt: 0, content: 0, __v: 0, messages: 0, AIChat: 0, sharedFiles: 0}).populate({
					path: 'todos.addedBy',
					select: 'name picture'
				}) :
				await Workspace.findById(workspaceId, {_id: 0, createdAt: 0, content: 0, __v: 0, messages: 0, AIChat: 0, sharedFiles: 0}).limit(n).populate({
					path: 'todos.addedBy',
					select: 'name picture'
				})
		);

		return workspace.todos;
	} catch (error) {
		logError(error);
		return null;
	}
};
