import './styles/App.css';
import {AuthProvider} from './contexts/AuthContext';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import CONFIG from './config';

import Workspace from './components/Workspace';
import {SocketProvider} from './contexts/SocketContext';
import {GoogleOAuthProvider} from '@react-oauth/google';

const App = () => {
	return <Router>
		<GoogleOAuthProvider clientId={CONFIG.GOOGLE_CLIENT_ID}>
			<AuthProvider>
				<SocketProvider>
					<Routes>
						<Route path="/" element={<PrivateRoute/>}>
							<Route path="/" element={<Navigate to={`/workspace/${uuidv4()}`}/>}/>
							<Route path="/workspace" element={<Navigate to={`/workspace/${uuidv4()}`}/>}/>
							<Route path="/workspace/:id" element={<Workspace/>}/>
						</Route>
						<Route path="/login" element={<Login/>}/>
						<Route path="*" element={<div>404 Not Found</div>}/>
					</Routes>
				</SocketProvider>
			</AuthProvider>
		</GoogleOAuthProvider>
	</Router>;
}

export default App;
