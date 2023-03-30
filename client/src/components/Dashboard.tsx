import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {Alert, Avatar, Button, Container} from '@mui/material';

const Dashboard = () => {
	const [error, setError] = useState('');
	const { currentUser, logout } : any = useAuth();
	const navigate = useNavigate();

	async function handleLogout() {
		setError('');

		if (await logout()) {
			return navigate('/login');
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
		<Button variant="outlined" onClick={handleLogout}>Logout</Button>
	</Container>;
};

export default Dashboard;
