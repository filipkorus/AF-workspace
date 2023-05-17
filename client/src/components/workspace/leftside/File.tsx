import React from 'react';
import {Box, Link} from '@mui/material';
import theme from '../../../utils/theme';
import {IWorkspaceSharedFile} from '../../../types';
import {ReactJSXElement} from '@emotion/react/types/jsx-namespace';
import CONFIG from '../../../config/index';
import {useParams} from 'react-router-dom';

const File = ({file, isUploading, children}: {
	file: IWorkspaceSharedFile,
	children: ReactJSXElement,
	isUploading?: boolean
}) => {
	const {id: workspaceId} = useParams();

	return <Box sx={{
		px: .6, py:.4, mx:2, my:.4,
		borderRadius: '.5rem',
		// border: 'solid black 1px',
		flexBasis: '100%', flexGrow: 1,
		backgroundColor: theme.palette.secondary.main,
		overflowX: 'auto'
	}}>
		<Box>
			{children}
			<Link
				href={`${CONFIG.API_URL}/api/${workspaceId}/sharedFile/${file.uniqueFilename}`}
				target="_blank"
				title={`download ${file.originalFilename}`}
			>
				{file.originalFilename.slice(0, 15) + (file.originalFilename.length > 15 ?'...':'')}
			</Link>
			{/*{uniqueFilename}*/}
		</Box>
	</Box>;
};

export default File;
