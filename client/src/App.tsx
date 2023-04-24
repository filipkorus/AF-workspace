import './styles/App.css';
import {AuthProvider} from './contexts/AuthContext';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

import Workspace from './components/Workspace';
import {SocketProvider} from './contexts/SocketContext';

const App = () => {
	return <Router>
		<AuthProvider>
			<SocketProvider>
			<Routes>
				<Route path="/" element={<PrivateRoute />}>
					<Route path="/" element={<Dashboard/>}/>
					<Route path="/workspace/:id" element={<Workspace/>}/>
				</Route>
				<Route path="/login" element={<Login/>} />
				<Route path="*" element={<div>404 Not Found</div>} />
			</Routes>
			</SocketProvider>
		</AuthProvider>
	</Router>;
}

export default App;
