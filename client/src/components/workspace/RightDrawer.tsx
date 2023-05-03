import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {styled, useTheme} from '@mui/material/styles';
import {IconButton, Toolbar, CssBaseline, Drawer, Box} from '@mui/material';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import {Menu as MenuIcon} from '@mui/icons-material';
import {AppBarProps} from './Main';

const drawerWidth = 270;

// const AppBar = styled(MuiAppBar, {
// 	shouldForwardProp: (prop) => prop !== 'open',
// })<AppBarProps>(({theme, open}) => ({
// 	transition: theme.transitions.create(['margin', 'width'], {
// 		easing: theme.transitions.easing.sharp,
// 		duration: theme.transitions.duration.leavingScreen,
// 	}),
// 	...(open && {
// 		width: `calc(100% - ${drawerWidth}px)`,
// 		marginLeft: `${drawerWidth}px`,
// 		transition: theme.transitions.create(['margin', 'width'], {
// 			easing: theme.transitions.easing.easeOut,
// 			duration: theme.transitions.duration.enteringScreen,
// 		}),
// 	}),
// }));

const DrawerHeader = styled('div')(({theme}) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}));

const RightDrawer = ({children}: { children?: JSX.Element }) => {
	const {id: workspaceId}: any = useParams();
	const theme = useTheme();
	const [open, setOpen] = useState(false);

	const handleDrawerOpen = () => setOpen(true);
	const handleDrawerClose = () => setOpen(false);
  
   const [messages, setMessages] = useState<string[]>([]);
    const handleSendMessage = (msg: {text: string, timestamp: string}) => {
        setMessages([...messages, msg.text]);
    };

	return <>

		<CssBaseline/>
		{/*<AppBar position='fixed' open={open} style={{*/}
		{/*	bottom: 0,*/}
		{/*	right: 0,*/}
		{/*	width: "50px",*/}
		{/*	backgroundColor: theme.palette.secondary.main,*/}
		{/*	border: "3px"*/}
		{/*}}>*/}
		{/*	<Toolbar>*/}
		{/*		<IconButton*/}
		{/*			onClick={handleDrawerOpen}*/}
		{/*			edge="start"*/}
		{/*			sx={{mr: 2, ...(open && {display: 'none'})}}*/}
		{/*		>*/}
		{/*			<MenuIcon/>*/}
		{/*		</IconButton>*/}
		{/*	</Toolbar>*/}
		{/*</AppBar>*/}
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
			{/*<DrawerHeader>*/}
			{/*	<MenuIcon/>*/}
			{/*	<IconButton onClick={handleDrawerClose}>*/}
			{/*		<p style={{fontSize: "16px", fontStyle: "oblique"}}> ID: {workspaceId} </p>*/}
			{/*		<ChevronRightIcon/>*/}
			{/*	</IconButton>*/}
			{/*</DrawerHeader>*/}

			<Box style={{margin: '.7rem'}} className='bg-whitesmoke'>
				{children}
        <List>
                    {['Chat'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemIcon>
                                <ChatBubbleOutline style={{marginLeft: 12}}/>
                            </ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
                <div style={{
                    position: 'fixed',
                    bottom: 70,
                    overflowX: "hidden",
                    wordBreak: 'break-all',
                    width: "260px",
                    marginLeft: "4px",
                    marginRight: "2px"
                }}>
                    {messages.map((message, index) => (
                        <div style={{
                            backgroundColor: "lavender",
                            borderRadius: "10px",
                            wordBreak: 'break-all',
                            marginTop: "3px",
                            marginBottom: "2px"
                        }}
                             key={index}>
                            {message}
                        </div>
                    ))}
                </div>
                <div style={{position: 'fixed', bottom: 0, margin: "2px", borderRadius: "10px"}}>
                    <ChatInput handleSendMessage={handleSendMessage}/>
                </div>
			</Box>
		</Drawer>
	</>;
};

export default RightDrawer;
