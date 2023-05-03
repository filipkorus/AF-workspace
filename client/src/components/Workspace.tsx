import {useParams} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {Alert, Box, LinearProgress, Snackbar} from '@mui/material';
import LeftDrawer from './workspace/leftside/LeftDrawer';
import React, {useEffect, useRef, useState} from 'react';
import {useSocket} from '../contexts/SocketContext';
import RightDrawer from './workspace/RightDrawer';
import QuillEditor from './workspace/leftside/QuillEditor';

const Workspace = () => {
	const {id}: any = useParams();
	const {currentUser}: any = useAuth();

	const [openReconnectedSnackbar, setOpenReconnectedSnackbar] = useState<boolean>(false);
	const [openReconnectingSnackbar, setOpenReconnectingSnackbar] = useState<boolean>(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);
	const firstRender = useRef(true);

	const {socket, isConnected}: any = useSocket();

	useEffect(() => {
		if (!isConnected) {
			setOpenReconnectingSnackbar(true);
			return;
		}

		socket.emit('join-workspace', id);

		if (!firstRender.current) {
			setOpenReconnectedSnackbar(true);
			timeoutRef.current.push(setTimeout(() => setOpenReconnectedSnackbar(false), 5000));
		}
		setOpenReconnectingSnackbar(false);

		firstRender.current = false;

		return () => {
			socket.emit('leave-workspace', id);
		};
	}, [isConnected]);

	useEffect(() => {
		if (socket != null) socket.connect();

		return () => {
			for (let timeout of timeoutRef.current) {
				clearTimeout(timeout);
			}
		};
	}, []);

	return <>
		<div style={{
			backgroundColor: "#F0B4E4",
			display: 'flex',
			flexFlow: 'column',
			height: '100%',
			overflowY: 'hidden'
		}}>
			<Box sx={{display: 'flex'}}>
				<LeftDrawer>
					<QuillEditor/>
				</LeftDrawer>
				<RightDrawer>
					<>
						<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aspernatur at consequatur culpa
							dolor
							doloribus eaque enim eos fugiat, fugit illo illum minus, modi nemo obcaecati saepe, sint vitae
							voluptatem.
						</div>
						<div>Ad autem earum eligendi enim excepturi harum id incidunt, ipsam magni modi nemo nisi, non nostrum
							numquam, odio quae qui repellat sequi velit voluptatum. Deserunt facilis harum laudantium voluptate
							voluptatem?
						</div>
					</>
				</RightDrawer>
			</Box>
		</div>

		<Snackbar open={openReconnectedSnackbar}>
			<Alert severity="success">Reconnected</Alert>
		</Snackbar>
		<Snackbar open={openReconnectingSnackbar}>
			<Box>
				<LinearProgress color="warning"/>
				<Alert severity="warning">Reconnecting...</Alert>
			</Box>
		</Snackbar>
	</>;
};

export default Workspace;
