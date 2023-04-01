import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {Alert, Avatar, Box, Button, Container, LinearProgress, Snackbar} from '@mui/material';
import api from '../api';
import {io, Socket} from 'socket.io-client';
import Chat from './Chat';

const Dashboard = () => {
	const [error, setError] = useState('');

	const { currentUser, logout } : any = useAuth();
	const navigate = useNavigate();

	const socket = useRef(
		io('http://localhost:5000', {
			autoConnect: false,
			auth: {
				token: (api.defaults.headers.common['Authorization'] as string)?.split(' ')[1]
			},
			rejectUnauthorized: true
		})
	);

	const [isConnected, setIsConnected] = useState(socket.current.connected);
	const [reconnectAttempt, setReconnectAttempt] = useState(0);
	const [openReconnectedSnackbar, setOpenReconnectedSnackbar] = useState(false);
	const [openReconnectingSnackbar, setOpenReconnectingSnackbar] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

	useEffect(() => {
		socket.current.connect();

		const onConnect = () => {
			console.log('connect');
			setIsConnected(true);
			setOpenReconnectingSnackbar(false);
			setReconnectAttempt(0);
		};
		const onDisconnect = () => {
			console.log('disconnect');
			setIsConnected(false);
		};
		const onError = (error: Error) => console.log(`error: ${error}`);
		const onConnectError = (err: Error) => {
			console.log(`connect_error due to ${err.message}`);
			if (err.message === 'Authentication error') {
				window.location.reload();
			}
		}
		const onReconnect = (attempt: number) => {
			setReconnectAttempt(0);
			setOpenReconnectingSnackbar(false);
			setOpenReconnectedSnackbar(true);
			timeoutRef.current.push(setTimeout(() => setOpenReconnectedSnackbar(false), 5000));
			console.log(`reconnect on attempt: ${attempt}`);
		}
		const onReconnectAttempt = (attempt: number) => {
			setOpenReconnectingSnackbar(true);
			setReconnectAttempt(attempt);
			console.log('reconnect_attempt: ' + attempt);
		}
		const onReconnectError = (error: Error) => console.log(`reconnect_error: ${error}`);
		const onReconnectFailed = () => console.log('reconnect_failed');

		const onGreetingFromServer = (data: any) => console.log(`Server sent message: ${data.msg}`);

		socket.current.on('connect', onConnect);
		socket.current.on('disconnect', onDisconnect);
		socket.current.on('error', onError);
		socket.current.on("connect_error", onConnectError);

		socket.current.io.on("error", onError);
		socket.current.io.on("reconnect", onReconnect);
		socket.current.io.on("reconnect_attempt", onReconnectAttempt);
		socket.current.io.on("reconnect_error", onReconnectError);
		socket.current.io.on("reconnect_failed", onReconnectFailed);

		socket.current.on('greeting-from-server', onGreetingFromServer)

		return () => {
			socket.current.off('connect', onConnect);
			socket.current.off('disconnect', onDisconnect);
			socket.current.off("error", onError);
			socket.current.off('connect_error', onConnectError);

			socket.current.io.off("error", onError);
			socket.current.io.off("reconnect", onReconnect);
			socket.current.io.off("reconnect_attempt", onReconnectAttempt);
			socket.current.io.off("reconnect_error", onReconnectError);
			socket.current.io.off("reconnect_failed", onReconnectFailed);

			socket.current.off('greeting-from-server', onGreetingFromServer);

			for (let timeout of timeoutRef.current) {
				clearTimeout(timeout);
			}
		};
	}, []);

	const sendMsg = () => socket.current.emit('msg', 'tiruriru');

	const handleLogout = async () => {
		setError('');

		if (await logout()) {
			// socket.current.emit('manual-disconnection');
			socket.current.disconnect()
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
		{/*<Button variant="outlined"*/}
		{/*        onClick={!isConnected ? handleSocketConnect : handleSocketDisconnect}>*/}
		{/*	{!isConnected ? 'Connect' : 'Disconnect'}*/}
		{/*</Button><br/>*/}
		{isConnected && <Button variant="outlined" onClick={sendMsg}>emit message</Button>}

		<p>Connection state: {isConnected ? 'connected' : 'disconnected'}</p>
		{reconnectAttempt > 0 && <p>Reconnecting... attempt: {reconnectAttempt}</p>}

		<Chat socket={socket.current} />

		<Snackbar open={openReconnectedSnackbar}>
			<Alert severity="success">Reconnected</Alert>
		</Snackbar>
		<Snackbar open={openReconnectingSnackbar}>
			<Box>
				<LinearProgress color="warning" />
				<Alert severity="warning">Reconnecting...</Alert>
			</Box>
		</Snackbar>
	</Container>;
};

export default Dashboard;
