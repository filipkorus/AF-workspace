import React, {useContext, useState, useEffect, createContext, useRef} from "react";
import api from "../api";
import {IUser} from '../types';

const AuthContext = createContext({});

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({children}: { children: JSX.Element }) {
	const [currentUser, setCurrentUser] = useState<IUser | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const firstUserRequest = useRef<boolean>(true);

	const login = async (credential: string): Promise<{success: string|null, error: string|null}> => {
		try {
			const {data} = await api.post('/user/auth/login', {credential}, {withCredentials: true});

			setCurrentUser(data?.user as IUser);
			api.defaults.headers.common['Authorization'] = `Bearer ${data?.token}`;
			setLoading(false);
			return {
				success: data?.msg || 'Logged in successfully',
				error: null
			};
		} catch (error) {
			setLoading(false);
			return {
				success: null,
				error: (error as any)?.response?.data?.msg || 'Server connection error'
			};
		}
	};

	const logout = async (): Promise<{success: string|null, error: string|null}> => {
		try {
			const {status, data} = await api.get('/user/auth/logout', {withCredentials: true});
			if (status === 200) {
				setCurrentUser(null);
				api.defaults.headers.common['Authorization'] = '';
				return {
					success: data?.msg as string || 'Logged out successfully',
					error: null
				};
			}
			return {
				success: null,
				error:  data?.msg as string || 'Server error'
			};
		} catch (error) {
			return {
				success: null,
				error: (error as any)?.response?.data?.msg as string || 'Server connection error'
			};
		}
	}

	const getUserWorkspaces = async () => {
		try {
			const {status, data} = await api.get('/user/workspaces');
			if (status === 200) {
				return data?.workspaces;
			}
			return [];
		} catch (error) {
			return [];
		}
	};

	useEffect(() => {
		if (!firstUserRequest.current) return;
		firstUserRequest.current = false;

		api
			.get('/user')
			.then(res => {
				if (res.data?.user) {
					setCurrentUser(res.data?.user as IUser);
					setLoading(false);
				}
			})
			.catch(error => setLoading(false));

		return () => setCurrentUser(null);
	}, []);

	const value = {
		currentUser,
		login,
		logout,
		getUserWorkspaces
	};

	return <AuthContext.Provider value={value}>
		{!loading && children}
	</AuthContext.Provider>;
}
