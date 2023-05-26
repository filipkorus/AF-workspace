import {Socket} from 'socket.io-client';
import React from 'react';

export default interface ISocketContext {
	socket: Socket | null,
	isConnected: boolean,
	reconnectAttempt: number,
	isRoomJoined: boolean,
	setIsRoomJoined: React.Dispatch<React.SetStateAction<boolean>>
};
