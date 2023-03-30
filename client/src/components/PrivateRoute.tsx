import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = () => {
	const { currentUser } : any = useAuth();

	return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
