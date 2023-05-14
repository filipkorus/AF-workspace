import React from 'react';
import {v4 as uuidv4} from 'uuid';
import {ListItemButton, ListItemText, ListItem} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import formatDate from '../../../utils/formatDate';

const WorkspaceList = ({workspaces}: any) => {
	const {id: workspaceId}: any = useParams();
	const navigate = useNavigate();

	const handleRedirectAndReload = (newRoute: string) => {
		navigate(newRoute);
		window.location.reload();
	};

	return workspaces.map((workspace: any) => workspace._id !== workspaceId && <ListItem component="div" disablePadding key={uuidv4()}>
		<ListItemButton onClick={() => handleRedirectAndReload(`/workspace/${workspace._id}`)}>
			<ListItemText primary={formatDate(workspace.createdAt)} sx={{
				textAlign: 'center'
			}}/>
		</ListItemButton>
	</ListItem>);
};

export default WorkspaceList;
