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
