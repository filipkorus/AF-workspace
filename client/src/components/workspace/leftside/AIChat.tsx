import React, {useEffect, useRef, useState} from 'react';
import ChatInput from '../ChatInput';
import {IWorkspaceAIChat, IWorkspaceMessage} from '../../../types';
import Message from '../Message';
import formatDate from '../../../utils/formatDate';
import {Box} from '@mui/material';
import {useAuth} from '../../../contexts/AuthContext';
import {useSocket} from '../../../contexts/SocketContext';
import {useParams} from 'react-router-dom';

const AIChat = () => {
	const [messages, setMessages] = useState<IWorkspaceAIChat[]>([]);
	const {currentUser}: any = useAuth();
	const {socket, isConnected, isRoomJoined}: any = useSocket();
	const {id: workspaceId} = useParams();
	const messageEndRef = useRef<HTMLDivElement>(null);

	const handleSendMessage = (msg: string) => {
		socket.emit('send-aichat-message', msg);

		setMessages([...messages, {
			content: msg,
			addedAt: new Date(),
			role: 'user',
			author: {
				_id: currentUser._id,
				picture: currentUser.picture,
				name: currentUser.name
			},
			_id: `${messages.length + 1}`
		}]);
	};

	useEffect(() => {
		if (socket == null || !isRoomJoined) return;

		socket.once('load-aichat-messages', (_messages: IWorkspaceAIChat[]) => {
			setMessages(_messages);
		});

		socket.emit('get-aichat-messages');
	}, [socket, isConnected, isRoomJoined, workspaceId]);

	/* receiving messages */
	useEffect(() => {
		if (socket == null) return;

		const handler = (msg: IWorkspaceAIChat) => {
			setMessages([...messages, msg]);
		};

		socket.on('receive-aichat-message', handler);

		return () => {
			socket.off('receive-aichat-message', handler);
		};
	}, [socket, messages]);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({behavior: "auto"});
	}, [messages]);

	return <>
		<Box sx={{
			maxHeight: '35dvh',
			overflowY: 'auto',
			ml: .6
		}}>
			{messages.map((msg: IWorkspaceAIChat, index) => (
				<Message name={msg.role === 'assistant' ? 'AI': msg.author?.name as string} content={msg.content} timestamp={formatDate(msg.addedAt)}
				         key={index} isMyMessage={msg.role === 'user' && msg.author?._id as string === currentUser._id}/>
			))}
			<div ref={messageEndRef}/>
		</Box>
		<ChatInput
			handleSendMessage={(text) => handleSendMessage(text)}
			placeholder="Send a message"
			sx={{m: 1}}
		/>
	</>;
};

export default AIChat;
