import {useContext} from "react";
import AuthContext from "../utils/auth/AuthContext";

const Dashboard = () => {
	const { user, logout } : any = useContext(AuthContext);

	return <div>
		<div>{JSON.stringify(user)}</div>
		<br/>
		<img src={user.picture} alt={user.name}/>
		<br/>
		<button onClick={logout}>log out</button>
	</div>;
};

export default Dashboard;
