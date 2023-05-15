import api from './index';
import {AxiosError} from 'axios';

export const getUserWorkspaces = async () => {
	try {
		const {status, data} = await api.get('/workspace');
		if (status === 200) {
			return data?.workspaces;
		}
		return [];
	} catch (error) {
		return [];
	}
};

export const deleteWorkspace = async (workspaceIdToDelete: string) => {
	try {
		const {status, data} = await api.delete(`/workspace/${workspaceIdToDelete}`);
		return status === 200;
	} catch (error) {
		return false;
	}
};

export const renameWorkspace = async (workspaceIdToRename: string, newName: string) => {
	try {
		const {status, data} = await api.put(`/workspace/${workspaceIdToRename}`, {name: newName});
		return status === 200;
	} catch (error) {
		return false;
	}
};

/**
 * @returns HTTP status code of the operation.
 * @param workspaceId ID of workspace.
 * @param email Email of user to be added.
 */
export const addUserToWorkspaceByEmail = async (workspaceId: string, email: string) => {
	try {
		const {status, data} = await api.post(`/workspace/${workspaceId}/member`, {email});
		return status;
	} catch (error: any) {
		return error?.response?.status;
	}
};

/**
 * @returns HTTP status code of the operation.
 * @param workspaceId ID of workspace.
 * @param email Email of user to be removed.
 */
export const removeUserFromWorkspaceByEmail = async (workspaceId: string, email: string) => {
	try {
		const {status, data} = await api.delete(`/workspace/${workspaceId}/member/${email}`);
		console.log(status, data);
		return status;
	} catch (error: any) {
		return error?.response?.status;
	}
};
