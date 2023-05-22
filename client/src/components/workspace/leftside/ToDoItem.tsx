import React from 'react';
import theme from '../../../utils/theme';
import {Box, IconButton, Link} from '@mui/material';
import {IWorkspaceTODO} from '../../../types';
import {Delete as DeleteIcon} from '@mui/icons-material';

const ToDoItem = ({todo, handleDelete, handleToggleIsDone}: {
	todo: IWorkspaceTODO,
	handleDelete: (todoId: string) => void,
	handleToggleIsDone: (todoId: string, isDone: boolean) => void
}) => {
	return <Box sx={{
		px: .6, py: .4, mx: 2, my: .4,
		borderRadius: '.5rem',
		// border: 'solid black 1px',
		flexBasis: '100%', flexGrow: 1,
		backgroundColor: theme.palette.secondary.main,
		overflowX: 'auto',
		cursor: 'pointer'
	}}
	            title={`mark as ${todo.isDone ? 'undone' : 'done'}`}
	            onClick={() => handleToggleIsDone(todo._id, !todo.isDone)}
	>
		<IconButton aria-label="delete" title="delete this ToDo" size="small"
		            onClick={(e) => {
			            e.stopPropagation();
			            handleDelete(todo._id)
		            }}>
			<DeleteIcon fontSize="inherit" color="error"/>
		</IconButton>

		<span style={{textDecoration: todo.isDone ? 'line-through' : ''}}>{todo.content}</span>
	</Box>;
};

export default ToDoItem;
