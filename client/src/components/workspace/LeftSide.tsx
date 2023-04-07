import React from 'react';
import {Avatar, Box, Button, Divider, Grid, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import theme from '../../utils/theme';

const LeftSide = () => {
	return <Grid item xs={2} style={{
		backgroundColor: theme.palette.primary.main,
		height: '100%',
		margin: '0.5%',
		justifyContent: 'center',
		alignItems: 'center'
	}}>
		<Box style={{
			backgroundColor: theme.palette.secondary.main,
			height: '99%',
			width: '95%',
			padding: '0.5%'
		}}
		>
			<ListItem>
				<Button sx={{width: '100%'}}>
					<ListItemAvatar>
						<Avatar>

						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="TODOs"/>
				</Button>
			</ListItem>
			<Divider/>
			<ListItem>
				<Button sx={{width: '100%'}}>
					<ListItemAvatar>
						<Avatar>

						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Drag & Drop"/>
				</Button>
			</ListItem>
			<Divider/>
			<ListItem>
				<Button sx={{width: '100%'}}>
					<ListItemAvatar>
						<Avatar>

						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Voting"/>
				</Button>
			</ListItem>
			<Divider/>
			<ListItem>
				<Button sx={{width: '100%'}}>
					<ListItemAvatar>
						<Avatar>

						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Saved work"/>
				</Button>
			</ListItem>
		</Box>
	</Grid>;
};

export default LeftSide;
