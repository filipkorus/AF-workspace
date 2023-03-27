import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthContextProvider } from "./utils/auth/AuthContext";
import ProtectedRoute from "./utils/auth/ProtectedRoute";
import PublicRoute from "./utils/auth/PublicRoute";

const App = () => {
	return <AuthContextProvider>
		<Routes>

			<Route path="/" element={
				<PublicRoute><Home/></PublicRoute>
			}></Route>

			<Route path="/login" element={
				<PublicRoute mustBeUnlogged={true}>
					<Login/>
				</PublicRoute>
			}></Route>

			<Route path="/dashboard" element={
				<ProtectedRoute>
					<Dashboard/>
				</ProtectedRoute>
			}></Route>

		</Routes>
	</AuthContextProvider>;
}

export default App;
