import api from './index';

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
