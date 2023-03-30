import {useContext, useState, useEffect, createContext, useRef} from "react";
import api from "../api";

const AuthContext = createContext({});

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children } : {children : JSX.Element}) {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const firstUserRequest = useRef(true);

	const login = async ({response, setError }: any) => {
		try {
			const {data} = await api.post('/user/auth/login', {credential:response.credential}, {withCredentials:true});

			setCurrentUser(data?.user);
			api.defaults.headers.common['Authorization'] = `Bearer ${data?.token}`;
		} catch (error) {
			setError((error as any)?.message);
		}
		setLoading(false);
	};

	const logout = async () => {
		try {
			const {status, data} = await api.get('/user/auth/logout', {withCredentials: true});
			if (status === 200) {
				setCurrentUser(null);
				api.defaults.headers.common['Authorization'] = '';
				return true;
			}
		} catch (error) {}
		return false;
	}

	useEffect(() => {
		if (!firstUserRequest.current) return;
		firstUserRequest.current = false;

		api
			.get('/user')
			.then(res => {
				if (res.data?.user) {
					setCurrentUser(res.data?.user);
					setLoading(false);
				}
			})
			.catch(error => setLoading(false));

		return () => setCurrentUser(null);
	}, []);

	const value = {
		currentUser,
		login,
		logout
	};

	return <AuthContext.Provider value={value}>
		{!loading && children}
	</AuthContext.Provider>;
}
