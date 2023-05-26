import {Alert, Box, LinearProgress, Snackbar} from '@mui/material';
import LeftDrawer from './workspace/leftside/LeftDrawer';
import React, {useEffect, useRef, useState} from 'react';
import {useSocket} from '../contexts/SocketContext';
import RightDrawer from './workspace/RightDrawer';
import QuillEditor from './workspace/QuillEditor';
import Chat from './workspace/Chat';
import theme from "../utils/theme";

const Workspace = () => {
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

        setOpenReconnectingSnackbar(false);

        firstRender.current = false;

        return () => {};
    }, [isConnected]);

    useEffect(() => {
        if (socket == null) return;

        const errorHandler = (error: any) => alert(error?.msg);
        socket.on('workspace-error', errorHandler);

        return () => {
            socket.off('workspace-error', errorHandler);
        };
    }, [socket]);

    useEffect(() => {
        if (socket != null) socket.connect();

        const timeouts = timeoutRef.current;

        return () => {
            for (let timeout of timeouts) {
                clearTimeout(timeout);
            }
        };
    }, [socket]);

    return <>
        <div style={{
            backgroundColor: theme.palette.secondary.main,
            flexFlow: 'column',
            // height: '100%',
        }}>
            <Box sx={{display: 'flex', height: '100dvh'}}>
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
