import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {ListItemButton, ListItem, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import {useAuth} from '../../../contexts/AuthContext';

const WorkspaceList = ({workspaces}: any) => {
	const {currentUser}: any = useAuth();
	const {id: workspaceId}: any = useParams();
	const navigate = useNavigate();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [workspaceIdToDelete, setWorkspaceIdToDelete] = useState<string | null>(null);

	const handleRedirectAndReload = (newRoute: string) => {
		navigate(newRoute);
		window.location.reload();
	};

	const handleDeleteWorkspace = (workspaceId: string) => {
		setWorkspaceIdToDelete(workspaceId);
		setOpenDialog(true);
	};

	const handleDeleteDialogClose = (deleteWorkspace: boolean) => {
		setOpenDialog(false);
		if (!deleteWorkspace) {
			setWorkspaceIdToDelete(null);
			return;
		}

		// delete workspace with ID = workspaceIdToDelete
	};

	return <>
		{workspaces.map((workspace: any) => workspace._id !== workspaceId &&
          <ListItem component="div" disablePadding key={uuidv4()}>
              <ListItem>
	              {workspace.createdBy === currentUser._id &&
		               <IconButton aria-label="delete" title="delete this workspace" size="small"
                              onClick={() => handleDeleteWorkspace(workspace._id)}>
                      <DeleteIcon fontSize="inherit" color="error"/>
                     </IconButton>
					  }
                  <ListItemButton
                      onClick={() => handleRedirectAndReload(`/workspace/${workspace._id}`)}
                  >
	                  {workspace._id.slice(0, 13) /* tu bedzie nazwa zamiast ucietego _id */}
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
					Chosen workspace ID = {workspaceIdToDelete}
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
