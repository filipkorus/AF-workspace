import React, {useState} from 'react';
import {PersonRemove as PersonRemoveIcon} from '@mui/icons-material';
import {
	Button, Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	TextField
} from '@mui/material';
import {useParams} from 'react-router-dom';
import {addUserToWorkspaceByEmail, removeUserFromWorkspaceByEmail, renameWorkspace} from '../../../api/workspace';

const AddUserToWorkspace = ({workspaceName}: {workspaceName: string}) => {
	const {id: workspaceId} = useParams();
	const [openRemoveUserDialog, setOpenRemoveUserDialog] = useState<boolean>(false);
	const [emailAddress, setEmailAddress] = useState<string | null>(null);

	const handleAddUserDialogClose = async (_removeUser: boolean) => {
		if (!_removeUser) {
			setOpenRemoveUserDialog(false);
			setEmailAddress(null);
			return;
		}

		if (workspaceId == null || emailAddress == null) {
			setOpenRemoveUserDialog(false);
			return;
		}

		const statusCode = await removeUserFromWorkspaceByEmail(workspaceId, emailAddress);

		if (statusCode === 200) {
			alert('User has been removed from workspace');
		} else if (statusCode === 404) {
			alert('User with given email was not found!');
		} else if (statusCode === 409) {
			alert('User with given email is not a member of this workspace!');
		} else {
			alert('An error occurred');
		}

		setOpenRemoveUserDialog(false);
		setEmailAddress(null);
	};

	return <>
		<IconButton aria-label="remove user" sx={{mr: 1, color: "whitesmoke"}} title="remove user from this workspace" size="small"
	                   onClick={() => {
								 setOpenRemoveUserDialog(true);
		                   setEmailAddress('');
	                   }}>
			<PersonRemoveIcon/>
		</IconButton>
		<Dialog
			open={openRemoveUserDialog}
			onClose={() => {}}
		>
			<DialogTitle>
				Remove user from workspace: {workspaceName}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{/*Chosen workspace: {workspaceToRename?.name}*/}
				</DialogContentText>
				<TextField
					required
					fullWidth
					label="Find user by email address"
					type="email"
					sx={{mt: 1}}
					onChange={(e) => setEmailAddress(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleAddUserDialogClose(false)} autoFocus>Cancel</Button>
				<Button onClick={() => handleAddUserDialogClose(true)} color="error">Remove</Button>
			</DialogActions>
		</Dialog>
	</>;
};

export default AddUserToWorkspace;
