import axios from "axios";
import CONFIG from '../config';

const api = axios.create({
	baseURL: `${CONFIG.API_URL}/api/`
});

let refresh = false;

api.interceptors.response.use(res => res, async error => {
	if (error.response.status === 401 && !refresh) {
		refresh = true;
		try {
			const {status, data} = await api.post('/user/auth/refresh', {}, {withCredentials: true});

			if (status === 200) {
				api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
				return api(error.config);
			}
		} catch (error) {}
	}

	refresh = false;
	return Promise.reject(error);
});

export default api;
