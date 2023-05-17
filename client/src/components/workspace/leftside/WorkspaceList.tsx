import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {ListItemButton, ListItem, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Typography } from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {Delete as DeleteIcon, Edit as EditIcon} from '@mui/icons-material';
import {useAuth} from '../../../contexts/AuthContext';
import {deleteWorkspace, renameWorkspace} from '../../../api/workspace';
import theme from '../../../utils/theme';
import workspace from '../../Workspace';

const WorkspaceList = ({workspaces, setWorkspaces}: any) => {
	const {currentUser}: any = useAuth();
	const {id: workspaceId}: any = useParams();
	const navigate = useNavigate();

	const [openDeleteWorkspaceDialog, setOpenDeleteWorkspaceDialog] = useState<boolean>(false);
	const [workspaceToDelete, setWorkspaceToDelete] = useState<{ id: string, name: string } | null>(null);

	const [openRenameWorkspaceDialog, setOpenRenameWorkspaceDialog] = useState<boolean>(false);
	const [workspaceToRename, setWorkspaceToRename] = useState<{ id: string, name: string } | null>(null);
	const [newName, setNewName] = useState<string | null>(null);

	const handleRedirectAndReload = (newRoute: string) => {
		navigate(newRoute);
		window.location.reload();
	};

	const handleDeleteWorkspace = ({id, name}: {id: string, name: string}) => {
		setWorkspaceToDelete({id, name});
		setOpenDeleteWorkspaceDialog(true);
	};

	const handleDeleteDialogClose = async (_deleteWorkspace: boolean) => {
		setOpenDeleteWorkspaceDialog(false);
		if (!_deleteWorkspace) {
			setWorkspaceToDelete(null);
			return;
		}

		if (workspaceToDelete == null) {
			return;
		}

		if (!(await deleteWorkspace(workspaceToDelete.id))) {
			setWorkspaceToDelete(null);
			return;
		}

		setWorkspaces(workspaces.filter((workspace: any) => workspace._id !== workspaceToDelete?.id));

		if (workspaceId === workspaceToDelete?.id && workspaces.length > 0) {
			handleRedirectAndReload(`/workspace/${workspaces[0]._id}`);
		}

		setWorkspaceToDelete(null);
	};

	const handleRenameWorkspace = ({id, name}: {id: string, name: string}) => {
		setWorkspaceToRename({id, name});
		setOpenRenameWorkspaceDialog(true);
	};

	const handleRenameDialogClose = async (_renameWorkspace: boolean) => {
		if (!_renameWorkspace) {
			setOpenRenameWorkspaceDialog(false);
			setNewName(null);
			setWorkspaceToRename(null);
			return;
		}

		if (workspaceToRename == null || newName == null) {
			setOpenRenameWorkspaceDialog(false);
			return;
		}

		if (newName.length < 4 || newName.length > 25) {
			return alert('Workspace name must be between 4 and 25 characters long!');
		}

		if (!(await renameWorkspace(workspaceToRename.id, newName))) {
			setOpenRenameWorkspaceDialog(false);
			setNewName(null);
			setWorkspaceToRename(null);
			return;
		}

		setOpenRenameWorkspaceDialog(false);

		setWorkspaces(workspaces.map((workspace: any) => {
			if (workspace._id === workspaceToRename.id) { workspace.name = newName; }
			return workspace;
		}));
		setNewName(null);
		setWorkspaceToRename(null);
	};

	return <>
		{workspaces.map((workspace: any) => <ListItem component="div" disablePadding key={uuidv4()} sx={{backgroundColor: workspace._id === workspaceId ? theme.palette.secondary.main : ''}}>
           <ListItem>
              {workspace.createdBy === currentUser._id &&
	               <IconButton aria-label="delete" title="delete this workspace" size="small"
                           onClick={() => handleDeleteWorkspace({id:workspace._id, name:workspace.name})}>
                   <DeleteIcon fontSize="inherit" color="error"/>
                  </IconButton>
				  }
               <ListItemButton
                   onClick={() => handleRedirectAndReload(`/workspace/${workspace._id}`)}
                   disabled={workspace._id === workspaceId}
               >
                  {workspace.name.slice(0, 14)}
					</ListItemButton>
               <IconButton aria-label="rename" title="rename this workspace" size="small"
                           onClick={() => handleRenameWorkspace({id:workspace._id, name:workspace.name})}>
                   <EditIcon fontSize="inherit" color="primary"/>
               </IconButton>
           </ListItem>
       </ListItem>)
		}

		<Dialog
			open={openDeleteWorkspaceDialog}
			onClose={() => {}}
		>
			<DialogTitle>
				Are you sure to permanently delete chosen workspace?
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Chosen workspace: {workspaceToDelete?.name}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleDeleteDialogClose(false)} autoFocus>Cancel</Button>
				<Button onClick={() => handleDeleteDialogClose(true)} color="error">Delete</Button>
			</DialogActions>
		</Dialog>

		<Dialog
			open={openRenameWorkspaceDialog}
			onClose={() => {}}
		>
			<DialogTitle>
				Are you sure to rename chosen workspace?
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Chosen workspace: {workspaceToRename?.name}
				</DialogContentText>
				<TextField
					required
					fullWidth
					label="Insert new name"

					sx={{mt: 1}}
					onChange={(e) => setNewName(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleRenameDialogClose(false)} autoFocus>Cancel</Button>
				<Button onClick={() => handleRenameDialogClose(true)} color="success">Save</Button>
			</DialogActions>
		</Dialog>
	</>;
};

export default WorkspaceList;
