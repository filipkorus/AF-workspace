import {createContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../api";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children } : any) => {
	const [user, setUser] = useState(null);

	const navigate = useNavigate();

	const googleAuthLogin = async ({setLoading, setError, response} : any) => {
		try {
			setLoading(true);

			const {data} = await api.post('/user/auth/login', {credential:response.credential}, {withCredentials:true});

			if (!data?.user) {
				return;
			}

			setLoading(false);

			api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

			setUser(data.user);
			navigate("/dashboard");
		} catch (error) {
			setError((error as any)?.message);
		}
	};

	const logout = async () => {
		try {
			const {status, data} = await api.get('/user/auth/logout', {withCredentials: true});
			if (status === 200) {
				setUser(null);
				api.defaults.headers.common['Authorization'] = '';
				navigate('/login?loggedOut=true');
			}
		} catch (error) {}
	};

	useEffect(() => {
			api
				.get('/user')
				.then(res => {
					if (res.data?.user) {
						setUser(res.data?.user);
					}
				})
				.catch(error => console.error(error?.response?.data?.msg));

		return () => setUser(null);
	}, []);

	return <AuthContext.Provider value={{ user, googleAuthLogin, logout }}>
		{children}
	</AuthContext.Provider>;
};

export default AuthContext;
