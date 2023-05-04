import React, {useState, useEffect, useRef} from 'react';
import {List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import {ChatBubbleOutline} from '@mui/icons-material';
import ChatInput from './ChatInput';
import {useSocket} from '../../contexts/SocketContext';

const Chat = () => {
	const {socket, isConnected}: any = useSocket();

	const [messages, setMessages] = useState<{text: string, timestamp: string}[]>([]);
	const messageEndRef = useRef<HTMLDivElement>(null); // referencja do końca diva z wiadomościami

	const handleSendMessage = (msg: { text: string, timestamp: string }) => {
		if (!isConnected) return;

		setMessages([...messages, { ...msg, timestamp: getCurrentTimestamp() }]);
	};
	const getCurrentTimestamp = () => {
		const date = new Date();
		const year = date.getFullYear();
		const month = ('0' + (date.getMonth() + 1)).slice(-2); // miesiące są liczone od 0 do 11, więc dodajemy 1 i formatujemy zerem z przodu
		const day = ('0' + date.getDate()).slice(-2);
		const hours = ('0' + date.getHours()).slice(-2);
		const minutes = ('0' + date.getMinutes()).slice(-2);
		const seconds = ('0' + date.getSeconds()).slice(-2);
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	};
	useEffect(() => {
		messageEndRef.current?.scrollIntoView({behavior: "auto"}); // przewijanie do końca diva z wiadomościami po zmianie zawartości
	}, [messages]);

	return (
		<>
			<List>
				{['Chat'].map((message, index) => (
					<ListItem  disablePadding>
						<ListItemIcon>
							<ChatBubbleOutline style={{marginLeft: 12}}/>
						</ListItemIcon>
						<ListItemText/>
					</ListItem>
				))}
			</List>
			<div style={{
				display: "inline-block",
				position: 'fixed',
				overflowX: "hidden",
				wordBreak: 'normal',
				width: "250px",
				marginLeft: "2px",
				marginRight: "2px",
				maxHeight: "79%",
				overflowY: "scroll"
			}}>
				{messages.map((message, index) => (
					<div style={{
						backgroundColor: "lavender",
						borderRadius: "10px",
						wordBreak: 'break-all',
						marginTop: "3px",
						marginBottom: "5px"
					}}
						 key={index}>
						{message.text}
						<div style={{fontSize: "smaller"}}>{message.timestamp}</div>
					</div>
				))}
				<div ref={messageEndRef} /> {/* pusty div użyty do ustawienia referencji */}
			</div>
			<div style={{position: 'fixed', bottom: "5px", margin: "2px", borderRadius: "10px"}}>
				<ChatInput handleSendMessage={handleSendMessage}/>
			</div>
		</>
	);
};

export default Chat;
