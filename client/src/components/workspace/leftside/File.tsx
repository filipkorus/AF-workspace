import React from 'react';
import {Box, IconButton, Link} from '@mui/material';
import theme from '../../../utils/theme';
import {useParams} from 'react-router-dom';
import api from '../../../api';
import {Delete as DeleteIcon} from '@mui/icons-material';
import saveBlobToFile from '../../../utils/saveBlobToFile';
import IWorkspaceSharedFile from '../../../types/IWorkspaceSharedFile';

const File = ({file, handleRemoveFile}: {
	file: IWorkspaceSharedFile,
	handleRemoveFile: (file: IWorkspaceSharedFile) => void
}) => {
	const {id: workspaceId} = useParams();

	const downloadFile = async (_file: IWorkspaceSharedFile) => {
		try {
			const {data} = await api.get(`/workspace/${workspaceId}/sharedFile/${_file.uniqueFilename}`, {
				responseType: 'blob'
			});
			const file = new Blob([data]);
			saveBlobToFile({
				blob: file,
				fileName: _file.originalFilename
			});
		} catch (error) {
			alert('Server error');
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
