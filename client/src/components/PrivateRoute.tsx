import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import IAuthContext from '../types/IAuthContext';

const PrivateRoute = () => {
	const { currentUser } = useAuth() as IAuthContext;

	return currentUser ? <Outlet /> : <Navigate to="/login?kickedOut=true" />;
}

export default PrivateRoute;
