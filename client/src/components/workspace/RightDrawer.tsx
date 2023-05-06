import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';
import {CssBaseline, Drawer, Box} from '@mui/material';

const drawerWidth = 270;

const RightDrawer = ({children}: { children?: JSX.Element }) => {
	const {id: workspaceId}: any = useParams();
	const theme = useTheme();
	const [open, setOpen] = useState(false);

	const handleDrawerOpen = () => setOpen(true);
	const handleDrawerClose = () => setOpen(false);

	const [messages, setMessages] = useState<string[]>([]);
	const handleSendMessage = (msg: { text: string, timestamp: string }) => {
		setMessages([...messages, msg.text]);
	};

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
