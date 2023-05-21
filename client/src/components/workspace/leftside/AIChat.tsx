import React, {useEffect, useRef, useState} from 'react';
import ChatInput from '../ChatInput';
import {IWorkspaceAIChat, IWorkspaceMessage} from '../../../types';
import Message from '../Message';
import formatDate from '../../../utils/formatDate';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton
} from '@mui/material';
import {useAuth} from '../../../contexts/AuthContext';
import {useSocket} from '../../../contexts/SocketContext';
import {useParams} from 'react-router-dom';
import {Delete as DeleteIcon} from '@mui/icons-material';
import {deleteWorkspace} from '../../../api/workspace';

const AIChat = () => {
	const [messages, setMessages] = useState<IWorkspaceAIChat[]>([]);
	const {currentUser}: any = useAuth();
	const {socket, isConnected, isRoomJoined}: any = useSocket();
	const {id: workspaceId} = useParams();
	const messageEndRef = useRef<HTMLDivElement>(null);

	const [openClearAIChatDialog, setOpenClearAIChatDialog] = useState<boolean>(false);

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

	/* clearing chat history */
	useEffect(() => {
		if (socket == null) return;

		const handler = () => {
			setMessages([]);
		};

		socket.on('receive-clear-aichat', handler);

		return () => {
			socket.off('receive-clear-aichat', handler);
		};
	}, [socket, messages]);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({behavior: "auto"});
	}, [messages]);

	const handleClearAIChatDialogClose = async (_clearAIChat: boolean) => {
		setOpenClearAIChatDialog(false);
		if (!_clearAIChat) {
			return;
		}

		if (socket == null || !isRoomJoined) {
			return alert('Connection error');
		}

		socket.emit('clear-aichat');

		setMessages([]);
	};

	return <>
		<Box sx={{
			maxHeight: '35dvh',
			overflowY: 'auto',
			ml: .6,
			mt: .7
		}}>
			{messages.map((msg: IWorkspaceAIChat, index) => (
				<Message name={msg.role === 'assistant' ? 'AI': msg.author?.name as string} content={msg.content} timestamp={formatDate(msg.addedAt)}
				         key={index} isMyMessage={msg.role === 'user' && msg.author?._id as string === currentUser._id}/>
			))}
			{messages.length > 0 &&
             <Button
                 variant="outlined"
                 size="small"
                 color="error"
                 sx={{mt:.7, mr: .5, width: '98%'}}
                 onClick={() => setOpenClearAIChatDialog(true)}
             >
                 Clear chat
             </Button>}
			<div ref={messageEndRef}/>
		</Box>
		<ChatInput
			handleSendMessage={(text) => handleSendMessage(text)}
			placeholder="Send a message"
			sx={{m: 1}}
		/>

		<Dialog
			open={openClearAIChatDialog}
			onClose={() => {}}
		>
			<DialogTitle>
				Are you sure to permanently clear the chat history?
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					New thread will be created.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleClearAIChatDialogClose(false)} autoFocus>Cancel</Button>
				<Button onClick={() => handleClearAIChatDialogClose(true)} color="error">Clear</Button>
			</DialogActions>
		</Dialog>
	</>;
};

export default AIChat;
