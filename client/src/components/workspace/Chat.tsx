import React, {useState} from 'react';
import {List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import {ChatBubbleOutline} from '@mui/icons-material';
import ChatInput from './ChatInput';

const Chat = () => {
	const [messages, setMessages] = useState<string[]>([]);
	const handleSendMessage = (msg: { text: string, timestamp: string }) => {
		setMessages([...messages, msg.text]);
	};

	return (
		<>
			<List>
				{['Chat'].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemIcon>
							<ChatBubbleOutline style={{marginLeft: 12}}/>
						</ListItemIcon>
						<ListItemText primary={text}/>
					</ListItem>
				))}
			</List>
			<div style={{
				position: 'fixed',
				bottom: 70,
				overflowX: "hidden",
				wordBreak: 'break-all',
				width: "260px",
				marginLeft: "4px",
				marginRight: "2px"
			}}>
				{messages.map((message, index) => (
					<div style={{
						backgroundColor: "lavender",
						borderRadius: "10px",
						wordBreak: 'break-all',
						marginTop: "3px",
						marginBottom: "2px"
					}}
					     key={index}>
						{message}
					</div>
				))}
			</div>
			<div style={{position: 'fixed', bottom: 0, margin: "2px", borderRadius: "10px"}}>
				<ChatInput handleSendMessage={handleSendMessage}/>
			</div>
		</>
	);
};

export default Chat;