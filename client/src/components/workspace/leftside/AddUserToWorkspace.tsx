import React, {useState} from 'react';
import {PersonAdd as PersonAddIcon} from '@mui/icons-material';
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
import {addUserToWorkspaceByEmail} from '../../../api/workspace';

const AddUserToWorkspace = ({workspaceName}: {workspaceName: string}) => {
	const {id: workspaceId} = useParams();
	const [openAddUserDialog, setOpenAddUserDialog] = useState<boolean>(false);
	const [emailAddress, setEmailAddress] = useState<string | null>(null);

	const handleAddUserDialogClose = async (_addUser: boolean) => {
		if (!_addUser) {
			setOpenAddUserDialog(false);
			setEmailAddress(null);
			return;
		}

		if (workspaceId == null || emailAddress == null) {
			setOpenAddUserDialog(false);
			return;
		}

		const statusCode = await addUserToWorkspaceByEmail(workspaceId, emailAddress);

		if (statusCode === 201) {
			alert('User has been added to workspace');
		} else if (statusCode === 404) {
			alert('User with given email was not found!');
		} else if (statusCode === 409) {
			alert('User with given email is already a member of this workspace!');
		} else {
			alert('An error occurred');
		}

		setOpenAddUserDialog(false);
		setEmailAddress(null);
	};

	return <>
		<IconButton aria-label="add user" sx={{mr: 1, color: "whitesmoke"}} title="add user to this workspace" size="small"
	                   onClick={() => {
								 setOpenAddUserDialog(true);
		                   setEmailAddress('');
	                   }}>
			<PersonAddIcon/>
		</IconButton>
		<Dialog
			open={openAddUserDialog}
			onClose={() => {}}
		>
			<DialogTitle>
				Add user to workspace: {workspaceName}
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
				<Button onClick={() => handleAddUserDialogClose(true)} color="success">Add</Button>
			</DialogActions>
		</Dialog>
	</>;
};

export default AddUserToWorkspace;
