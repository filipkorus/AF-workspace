import React, {useState, useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import ChatInput from './ChatInput';
import {useSocket} from '../../contexts/SocketContext';
import Message from "./Message";
import {useAuth} from "../../contexts/AuthContext";
import '../../styles/Scroll.css';
import {useParams} from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import IWorkspaceMessage from '../../types/IWorkspaceMessage';
import ISocketContext from '../../types/ISocketContext';
import IAuthContext from '../../types/IAuthContext';

const Chat = () => {
	const {socket, isConnected, isRoomJoined} = useSocket() as ISocketContext;
	const {id: workspaceId} = useParams();
	const [messages, setMessages] = useState<IWorkspaceMessage[]>([]);
	const messageEndRef = useRef<HTMLDivElement>(null); // referencja do końca diva z wiadomościami
	const {currentUser} = useAuth() as IAuthContext;
	const handleSendMessage = (msg: string) => {
		if (socket == null || currentUser == null) return;

		socket.emit('send-message', msg);

		setMessages([...messages, {
			content: msg,
			createdAt: new Date(),
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

		socket.once('load-messages', (messages: IWorkspaceMessage[]) => {
			setMessages(messages);
		});

		socket.emit('get-messages');
	}, [socket, isConnected, isRoomJoined, workspaceId]);

	/* receiving messages */
	useEffect(() => {
		if (socket == null) return;

		const handler = (msg: IWorkspaceMessage) => {
			setMessages([...messages, msg]);
		};

		socket.on('receive-message', handler);

		return () => {
			socket.off('receive-message', handler);
		};
	}, [socket, messages]);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({behavior: "auto"}); // przewijanie do końca diva z wiadomościami po zmianie zawartości
	}, [messages]);

	return (
		<>
			<Box style={{
				display: "inline-block",
				position: 'fixed',
				overflowX: "hidden",
				wordBreak: 'normal',
				width: "250px",
				marginLeft: "2px",
				marginRight: "2px",
				maxHeight: "79%",
				overflowY: "auto"
			}}>
				{messages.map((message: IWorkspaceMessage, index) => (
					<Message name={message.author.name} content={message.content} timestamp={formatDate(message.createdAt)}
					         key={index} isMyMessage={message.author._id === currentUser?._id}/>
				))}
				<div ref={messageEndRef}/>
				{/* pusty div użyty do ustawienia referencji */}
			</Box>
			<div style={{position: 'fixed', bottom: "20px", borderRadius: "10px"}}>
				<ChatInput handleSubmit={handleSendMessage}/>
			</div>
		</>
	);
};

export default Chat;
