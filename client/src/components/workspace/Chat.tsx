import React, {useState, useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import ChatInput from './ChatInput';
import {useSocket} from '../../contexts/SocketContext';
import Message from "./Message";
import {useAuth} from "../../contexts/AuthContext";
import '../../styles/Scroll.css';
import {useParams} from 'react-router-dom';
import {IWorkspaceMessage} from '../../types';

const Chat = ({isRoomJoined}: any) => {
	const {socket, isConnected}: any = useSocket();
	const {id: workspaceId}: any = useParams();
	const [messages, setMessages] = useState<IWorkspaceMessage[]>([]);
	const messageEndRef = useRef<HTMLDivElement>(null); // referencja do końca diva z wiadomościami
	const {currentUser}: any = useAuth();
	const handleSendMessage = (msg: string) => {
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

		socket.on('load-messages', (messages: IWorkspaceMessage[]) => {
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

	const formatDate = (date: Date | string) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = ('0' + (d.getMonth() + 1)).slice(-2); // miesiące są liczone od 0 do 11, więc dodajemy 1 i formatujemy zerem z przodu
		const day = ('0' + d.getDate()).slice(-2);
		const hours = ('0' + d.getHours()).slice(-2);
		const minutes = ('0' + d.getMinutes()).slice(-2);
		return `${day}/${month}/${year} ${hours}:${minutes}`;
	};
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
				overflowY: "auto",
			}}>
				{messages.map((message: IWorkspaceMessage, index) => (
					<Message name={message.author.name} content={message.content} timestamp={formatDate(message.createdAt)}
					         key={index} isMyMessage={message.author._id === currentUser._id}/>
				))}
				<div ref={messageEndRef}/>
				{/* pusty div użyty do ustawienia referencji */}
			</Box>
			<div style={{position: 'fixed', bottom: "20px", borderRadius: "10px"}}>
				<ChatInput handleSendMessage={handleSendMessage}/>
			</div>
		</>
	);
};

export default Chat;
