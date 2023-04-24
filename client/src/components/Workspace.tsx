import {useParams} from "react-router-dom";
import {useAuth} from '../contexts/AuthContext';
import {Alert, Box, Grid, LinearProgress, Snackbar} from '@mui/material';
import LeftDrawer from "./workspace/leftside/LeftDrawer";
import Center from './workspace/Center';
import RightSide from './workspace/RightSide';
import logo from '../assets/logo.png';
import {useEffect, useRef, useState} from 'react';
import {useSocket} from '../contexts/SocketContext';

const Workspace = () => {
	const {id} : any = useParams();
	const {currentUser} : any = useAuth();

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
		return () => {
			for (let timeout of timeoutRef.current) {
				clearTimeout(timeout);
			}
		};
	}, []);

    return <>
        <div style={{
            backgroundColor: "#F0B4E4",
            // backgroundImage: `url(${logo})`,
            // backgroundSize: "auto",
            // backgroundRepeat: "no-repeat",
            // backgroundPosition: "center",
            // height: '110%',
            display: 'flex',
            flexFlow: 'column',
            height: '100%',
            // padding: '10px'
        }}>
            <LeftDrawer/>
            {/*center komentujemy najprawdopodobniej na zawze -> right side roboczo*/}
            {/*<Center/>*/}
            {/*<RightSide/>*/}
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
