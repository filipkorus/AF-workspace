import {useEffect, useRef, useState} from 'react';
import {useNavigate, Link as RouterLink} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {Alert, Avatar, Box, Button, Container, LinearProgress, Snackbar} from '@mui/material';

const Dashboard = () => {
	const [error, setError] = useState('');
	const randomId = 'random_workspace_id';

	const { currentUser, logout } : any = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		setError('');

		if (await logout()) {
			return navigate('/login?loggedOut=true');
		}

		setError('Failed to log out');
	}

	return <Container maxWidth="lg">
		{error && <Alert severity="error" color="error">{error}</Alert>}
		<div>{JSON.stringify(currentUser)}</div>
		<Avatar
			alt={currentUser.name}
			src={currentUser.picture}
			sx={{ width: 96, height: 96 }}
		/>
		<Button variant="outlined" onClick={handleLogout}>Logout</Button><br/>
		<Button variant="outlined">
			<RouterLink style={{textDecoration: 'none'}} to={`/workspace/${randomId}`}>Workspace: {randomId}</RouterLink>
		</Button>
	</Container>;
};

export default Dashboard;
