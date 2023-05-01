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
			</Box>
		</Drawer>
	</>;
};

export default RightDrawer;
