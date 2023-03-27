import {useContext} from "react";
import AuthContext from "./AuthContext";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children} : { children: JSX.Element }) => {
	const { user } : any = useContext(AuthContext);

	return user ? children : <Navigate to="/login"></Navigate>;
};

export default ProtectedRoute;
