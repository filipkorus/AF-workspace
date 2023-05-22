import React, {useEffect} from 'react';
import {Box} from "@mui/material";
import {useSocket} from "../../../contexts/SocketContext";
import ChatInput from '../ChatInput';
import {IWorkspaceTODO} from '../../../types';
import {v4 as uuidv4} from 'uuid';
import ToDoItem from './ToDoItem';

const ToDoList = ({todos, setTodos}: {
	todos: IWorkspaceTODO[],
	setTodos: React.Dispatch<React.SetStateAction<IWorkspaceTODO[]>>
}) => {
	const {socket, isConnected, isRoomJoined}: any = useSocket();

	const handleAddTodo = (content: string) => {
		const trimmedContent = content.trim();

		if (trimmedContent.length === 0) return;

		socket.emit('create-todo', trimmedContent);
	};

	/* creating ToDos */
	useEffect(() => {
		if (socket == null) return;

		const handler = (newTodo: IWorkspaceTODO) => {
			setTodos([...todos, newTodo]);
		};

		socket.on('receive-create-todo', handler);

		return () => {
			socket.off('receive-create-todo', handler);
		};
	}, [socket, todos]);

	/* removing ToDos */
	useEffect(() => {
		if (socket == null) return;

		const handler = (todoId: string) => {
			setTodos(
				todos.filter((todo: IWorkspaceTODO) => todo._id !== todoId)
			);
		};

		socket.on('receive-delete-todo', handler);

		return () => {
			socket.off('receive-delete-todo', handler);
		};
	}, [socket, todos]);

	/* marking ToDos as done or undone */
	useEffect(() => {
		if (socket == null) return;

		const handler = (todoId: string, isDone: boolean) => {
			setTodos(
				todos.map((todo: IWorkspaceTODO) => {
					if (todo._id === todoId) return {...todo, isDone};
					return todo;
				})
			);
		};

		socket.on('receive-mark-todo', handler);

		return () => {
			socket.off('receive-mark-todo', handler);
		};
	}, [socket, todos]);

	const handleToDoDelete = (todoId: string) => {
		socket.emit('delete-todo', todoId);

		setTodos(
			todos.filter((todo: IWorkspaceTODO) => todo._id !== todoId)
		);
	};

	const handleMarkToDoAsDoneOrUndone = (todoId: string, isDone: boolean) => {
		socket.emit('mark-todo', todoId, isDone);

		setTodos(
			todos.map((todo: IWorkspaceTODO) => {
				if (todo._id === todoId) return {...todo, isDone};
				return todo;
			})
		);
	};

	return <>
		<Box sx={{mx: 2, my: 1}}>
			<ChatInput handleSubmit={(text: string) => handleAddTodo(text)} placeholder="Add todo" rows={1} addIcon/>
		</Box>

		<Box sx={{maxHeight: '30dvh', overflowY: 'auto'}}>
			{todos?.map((todo: IWorkspaceTODO) => <ToDoItem
				key={uuidv4()}
				todo={todo}
				handleDelete={(todoId: string) => handleToDoDelete(todoId)}
				handleToggleIsDone={(todoId: string, isDone: boolean) => handleMarkToDoAsDoneOrUndone(todoId, isDone)}/>
			)}
		</Box>
	</>;
}

export default ToDoList;
