import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {ListItemButton, ListItem, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import {useAuth} from '../../../contexts/AuthContext';
import {deleteWorkspace} from '../../../api/workspace';

const WorkspaceList = ({workspaces, setWorkspaces}: any) => {
	const {currentUser}: any = useAuth();
	const {id: workspaceId}: any = useParams();
	const navigate = useNavigate();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [workspaceToDelete, setWorkspaceToDelete] = useState<{ id: string, name: string } | null>(null);

	const handleRedirectAndReload = (newRoute: string) => {
		navigate(newRoute);
		window.location.reload();
	};

	const handleDeleteWorkspace = ({id, name}: {id: string, name: string}) => {
		setWorkspaceToDelete({id, name});
		setOpenDialog(true);
	};

	const handleDeleteDialogClose = async (_deleteWorkspace: boolean) => {
		setOpenDialog(false);
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
		setWorkspaceToDelete(null);
	};

	return <>
		{workspaces.map((workspace: any) => workspace._id !== workspaceId &&
          <ListItem component="div" disablePadding key={uuidv4()}>
              <ListItem>
	              {workspace.createdBy === currentUser._id &&
		               <IconButton aria-label="delete" title="delete this workspace" size="small"
                              onClick={() => handleDeleteWorkspace({id:workspace._id, name:workspace.name})}>
                      <DeleteIcon fontSize="inherit" color="error"/>
                     </IconButton>

					  }
                  <ListItemButton
                      onClick={() => handleRedirectAndReload(`/workspace/${workspace._id}`)}
                  >
	                  {workspace.name.slice(0, 15)}
						</ListItemButton>
              </ListItem>
          </ListItem>)
		}

		<Dialog
			open={openDialog}
			onClose={() => {}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				Are you sure to permanently delete chosen workspace?
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Chosen workspace: {workspaceToDelete?.name}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleDeleteDialogClose(false)} autoFocus>Cancel</Button>
				<Button onClick={() => handleDeleteDialogClose(true)} color="error">Delete</Button>
			</DialogActions>
		</Dialog>
	</>;
};

export default WorkspaceList;
