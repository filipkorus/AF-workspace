import {useParams} from "react-router-dom";
import {useAuth} from '../contexts/AuthContext';
import {Alert, Box, Grid, LinearProgress, Snackbar} from '@mui/material';
import LeftSide from './workspace/LeftSide';
import Center from './workspace/Center';
import RightSide from './workspace/RightSide';
import logo from '../assets/logo.png';
import {useEffect, useRef, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import api from '../api';
import {User} from '../types';

const Workspace = () => {
	const {id} : any = useParams();
	const {currentUser} : any = useAuth();

	// socket.io related stuff
	const socket = useRef<Socket>(
		io('http://localhost:5000', {
			autoConnect: false,
			auth: {
				token: (api.defaults.headers.common['Authorization'] as string)?.split(' ')[1]
			},
			rejectUnauthorized: true
		})
	);

	const [isConnected, setIsConnected] = useState<boolean>(socket.current.connected);
	const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);
	const [openReconnectedSnackbar, setOpenReconnectedSnackbar] = useState<boolean>(false);
	const [openReconnectingSnackbar, setOpenReconnectingSnackbar] = useState<boolean>(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

	useEffect(() => {
		(socket.current.auth as any).token = (api.defaults.headers.common['Authorization'] as string)?.split(' ')[1];
	}, [api.defaults.headers.common['Authorization']]);

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
		const onConnectError = (error: Error) => {
			console.log(`connect_error due to ${error.message}`);
			if (error.message === 'Authentication error') {
				// window.location.reload();
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
		const onReconnectError = (error: Error) => {
			console.log(`reconnect_error: ${error}`);
			if (error?.message === 'Authentication error') {
				// window.location.reload();
			}
		}
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
	// end of socket.io related stuff

	return <>
		<Grid container spacing={1}
		      direction="row"
		      justifyContent="center"
		      alignItems="center"
		      style={{
			      backgroundColor: "#F0B4E4",
			      backgroundImage: `url(${logo})`,
			      backgroundSize: "auto",
			      backgroundRepeat: "no-repeat",
			      backgroundPosition: "center",
			      height: '100vh',
			      padding: '10px'
		      }}
		>
			<LeftSide/>
			<Center/>
			<RightSide/>
		</Grid>

		<Snackbar open={openReconnectedSnackbar}>
			<Alert severity="success">Reconnected</Alert>
		</Snackbar>
		<Snackbar open={openReconnectingSnackbar}>
			<Box>
				<LinearProgress color="warning" />
				<Alert severity="warning">Reconnecting...</Alert>
			</Box>
		</Snackbar>
	</>;
};

export default Workspace;
