import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import api from '../api';

const SocketContext = createContext(null);

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({children}: { children: JSX.Element }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isWorkspaceJoined, setIsWorkspaceJoined] = useState<boolean>(false);
	const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);

	useEffect(() => {
		const accessToken = (api.defaults.headers.common['Authorization'] as string)?.split(' ')[1];
		const newSocket = io('http://localhost:5000', {
			// autoConnect: false,
			auth: {
				token: accessToken
			},
			rejectUnauthorized: true
		});

		const onConnect = () => {
			console.log('connect');
			setIsWorkspaceJoined(true);
			setReconnectAttempt(0);
		};
		const onDisconnect = () => {
			console.log('disconnect');
			setIsWorkspaceJoined(false);
		};
		const onError = (error: Error) => console.log(`error: ${error}`);
		const onConnectError = (error: Error) => {
			console.log(`connect_error due to ${error.message}`);
			if (error.message === 'Authentication error') {
				if (accessToken != null) {
					window.location.reload();
				}
			}
		}
		const onReconnect = (attempt: number) => {
			setReconnectAttempt(0);
			setIsWorkspaceJoined(true);
			console.log(`reconnect on attempt: ${attempt}`);
		}
		const onReconnectAttempt = (attempt: number) => {
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

		newSocket.on('connect', onConnect);
		newSocket.on('disconnect', onDisconnect);
		newSocket.on('error', onError);
		newSocket.on("connect_error", onConnectError);

		newSocket.io.on("error", onError);
		newSocket.io.on("reconnect", onReconnect);
		newSocket.io.on("reconnect_attempt", onReconnectAttempt);
		newSocket.io.on("reconnect_error", onReconnectError);
		newSocket.io.on("reconnect_failed", onReconnectFailed);

		newSocket.on('greeting-from-server', onGreetingFromServer);

		setSocket(newSocket);

		return () => {
			newSocket.off('connect', onConnect);
			newSocket.off('disconnect', onDisconnect);
			newSocket.off("error", onError);
			newSocket.off('connect_error', onConnectError);

			newSocket.io.off("error", onError);
			newSocket.io.off("reconnect", onReconnect);
			newSocket.io.off("reconnect_attempt", onReconnectAttempt);
			newSocket.io.off("reconnect_error", onReconnectError);
			newSocket.io.off("reconnect_failed", onReconnectFailed);

			newSocket.off('greeting-from-server', onGreetingFromServer);

			newSocket.close();
		}
	}, []);

	const joinWorkspace = (workspaceId: string) => {
		if (socket == null) return;

		socket.emit('join-workspace', workspaceId);
		setIsWorkspaceJoined(true);
	};

	const leaveWorkspace = (workspaceId: string) => {
		if (socket == null) return;

		socket.emit('leave-workspace', workspaceId);
		setIsWorkspaceJoined(false);
	};

	const value = {
		socket,
		isConnected: isWorkspaceJoined,
		joinWorkspace,
		leaveWorkspace,
		isWorkspaceJoined
	} as any;

	return <SocketContext.Provider value={value}>
		{children}
	</SocketContext.Provider>;
}
