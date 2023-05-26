import {useState} from 'react';
import {CssBaseline, Drawer, Box} from '@mui/material';

const drawerWidth = 270;

const RightDrawer = ({children}: { children?: JSX.Element }) => {
	const [open, setOpen] = useState(false);

	const handleDrawerOpen = () => setOpen(true);
	const handleDrawerClose = () => setOpen(false);

	return <>
		<CssBaseline/>
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			variant="permanent"
			anchor="right"
			open={open}
		>
			<Box style={{margin: '.7rem'}} className='bg-whitesmoke'>
				{children}
			</Box>
		</Drawer>
	</>;
};

export default RightDrawer;
