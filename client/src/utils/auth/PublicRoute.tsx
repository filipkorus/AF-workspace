import {useContext} from "react";
import AuthContext from "./AuthContext";
import {Navigate} from "react-router-dom";

const PublicRoute = ({children, mustBeUnlogged=false} : { children: JSX.Element, mustBeUnlogged?: boolean }) => {
	const { user } : any = useContext(AuthContext);

	return mustBeUnlogged && user ? <Navigate to="/dashboard"></Navigate> : children;
};

export default PublicRoute;
