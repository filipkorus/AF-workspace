import React from 'react';
import {Box, IconButton, Link} from '@mui/material';
import theme from '../../../utils/theme';
import {IWorkspaceSharedFile} from '../../../types';
import {ReactJSXElement} from '@emotion/react/types/jsx-namespace';
import {useParams} from 'react-router-dom';
import api from '../../../api';
import {Delete as DeleteIcon} from '@mui/icons-material';

const File = ({file, handleRemoveFile, isUploading}: {
	file: IWorkspaceSharedFile,
	handleRemoveFile: (file: IWorkspaceSharedFile) => void
	isUploading?: boolean
}) => {
	const {id: workspaceId} = useParams();

	const downloadFile = async (_file: IWorkspaceSharedFile) => {
		try {
			const {data} = await api.get(`/workspace/${workspaceId}/sharedFile/${_file.uniqueFilename}`, {
				responseType: 'blob'
			});
			const file = new Blob([data]);
			const a = document.createElement('a');
			const url = URL.createObjectURL(file);

			a.href = url;
			a.download = _file.originalFilename;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 0);
		} catch (error) {
			alert('Server error');
			console.log(error);
		}
	};

	return <Box sx={{
		px: .6, py:.4, mx:2, my:.4,
		borderRadius: '.5rem',
		// border: 'solid black 1px',
		flexBasis: '100%', flexGrow: 1,
		backgroundColor: theme.palette.secondary.main,
		overflowX: 'auto'
	}}>
		<Box>
			<IconButton aria-label="delete" title={`delete ${file.originalFilename}`} size="small"
			            onClick={() => handleRemoveFile(file)}>
				<DeleteIcon fontSize="inherit" color="error"/>
			</IconButton>
			<Link
				onClick={() => downloadFile(file)}
				title={`download ${file.originalFilename}`}
				style={{cursor: 'pointer'}}
			>
				{file.originalFilename.slice(0, 15) + (file.originalFilename.length > 15 ?'...':'')}
			</Link>
		</Box>
	</Box>;
};

export default File;
