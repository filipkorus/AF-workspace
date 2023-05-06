import {useParams} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {Alert, Box, LinearProgress, Snackbar} from '@mui/material';
import LeftDrawer from './workspace/leftside/LeftDrawer';
import React, {useEffect, useRef, useState} from 'react';
import {useSocket} from '../contexts/SocketContext';
import RightDrawer from './workspace/RightDrawer';
import QuillEditor from './workspace/QuillEditor';
import Chat from './workspace/Chat';
import theme from "../utils/theme";

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

        if (!firstRender.current) {
            setOpenReconnectedSnackbar(true);
            timeoutRef.current.push(setTimeout(() => setOpenReconnectedSnackbar(false), 5000));
        }

        socket.emit('join-workspace', id);

        setOpenReconnectingSnackbar(false);

        firstRender.current = false;

        return () => {
            if (!isConnected) return;

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
            backgroundColor: theme.palette.secondary.main,
            flexFlow: 'column',
            // height: '100%',
        }}>
            <Box sx={{display: 'flex'}}>
                <LeftDrawer>
                    <QuillEditor/>
                </LeftDrawer>
                <RightDrawer>
                    <Chat/>
                </RightDrawer>
            </Box>
            <Snackbar open={openReconnectedSnackbar}>
                <Alert severity="success">Reconnected</Alert>
            </Snackbar>
            <Snackbar open={openReconnectingSnackbar}>
                <Box>
                    <LinearProgress color="warning"/>
                    <Alert severity="warning">Reconnecting...</Alert>
                </Box>
            </Snackbar>
        </div>

    </>;
};

export default Workspace;
