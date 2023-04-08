import React, {useContext, useState, useEffect, createContext, useRef} from "react";
import api from "../api";
import {User} from '../types';

const AuthContext = createContext({});

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children } : {children : JSX.Element}) {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const firstUserRequest = useRef<boolean>(true);

	const login = async (credential : string) => {
		try {
			const {data} = await api.post('/user/auth/login', {credential}, {withCredentials:true});

			setCurrentUser(data?.user as User);
			api.defaults.headers.common['Authorization'] = `Bearer ${data?.token}`;
			setLoading(false);
			return {
				success: data?.msg || true,
				error: null
			};
		} catch (error) {
			setLoading(false);
			return {
				success: null,
				error: (error as any)?.response?.data?.msg
			};
		}
	};

	const logout = async () => {
		try {
			const {status, data} = await api.get('/user/auth/logout', {withCredentials: true});
			if (status === 200) {
				setCurrentUser(null);
				api.defaults.headers.common['Authorization'] = '';
				return {
					success: data.msg,
					error: null
				};
			}
		} catch (error) {
			return {
				success: null,
				error: (error as any)?.response?.data?.msg
			};
		}
	}

	useEffect(() => {
		if (!firstUserRequest.current) return;
		firstUserRequest.current = false;

		api
			.get('/user')
			.then(res => {
				if (res.data?.user) {
					setCurrentUser(res.data?.user as User);
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
