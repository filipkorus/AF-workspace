import {useTheme} from '@mui/material/styles';
import {Drawer, CssBaseline, Toolbar, List, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, AvatarGroup, Box, Collapse } from '@mui/material';
import {Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, AddTask as AddTaskIcon, Poll as PollIcon, AttachFile as AttachFileIcon, SavedSearch as SavedSearchIcon, ExpandLess, ExpandMore} from "@mui/icons-material";
import ToDos from './ToDos';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAuth} from '../../../contexts/AuthContext';
import Main, {AppBar, DrawerHeader, drawerWidth} from '../Main';
import StyledBadge from '../StyledBadge';

const LeftDrawer = ({children}: { children?: JSX.Element }) => {
	const [openIndex, setOpenIndex] = useState(-1);
	const [mobileOpen, setMobileOpen] = useState(false);
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
	const handleClick = (index: any) => {
		if (openIndex === index) {
			return setOpenIndex(-1);
		}
		setOpenIndex(index);
	};
	const theme = useTheme();
	const [openMain, setOpenMain] = useState(false);

	const handleDrawerOpen = () => setOpenMain(true);
	const handleDrawerClose = () => setOpenMain(false);

	const {id: workspaceId} = useParams<string>();
	const {currentUser}: any = useAuth();

	/**
	 * Jak cos to ta funkcja jest niezaimplementowana - nie pobiera aktywnych uzytkownikow z serwera.
	 */
	const getActiveUsers = () => {
		const avatars = [];
		for (let i = 0; i < 10; ++i) {
			avatars.push(
				<StyledBadge
					overlap="circular"
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					variant="dot"
					key={i}
				>
					<Avatar
						src={currentUser.picture}
						alt={currentUser.name}
						title={currentUser.name}
					/>
				</StyledBadge>)
		}
		return avatars;
	}

	return <>
		<CssBaseline/>
		<AppBar position="fixed" open={openMain}>
			<Toolbar style={{backgroundColor: theme.palette.secondary.main}}>
				<IconButton
					aria-label="open drawer"
					onClick={handleDrawerOpen}
					edge="start"
					sx={{mr: 2, ...(openMain && {display: 'none'})}}
				>
					<MenuIcon/>
				</IconButton>
				<Box>
					{/* TODO: zrobic zeby lista aktywnych uzytkownikow byla aligned to right */}
					<AvatarGroup max={4}>
						{getActiveUsers()}
					</AvatarGroup>
				</Box>
			</Toolbar>
		</AppBar>
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			variant="persistent"
			anchor="left"
			open={openMain}
		>
			<DrawerHeader>
				<IconButton onClick={handleDrawerClose}>
					{theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
				</IconButton>
			</DrawerHeader>
			<Divider/>
			<List>
				{['To Dos', 'Voting', 'Saved work', 'Drag n Drop'].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton onClick={() => handleClick(index)}>
							<ListItemIcon>
								{index % 4 === 0 && <AddTaskIcon/>}
								{index % 4 === 1 && <PollIcon/>}
								{index % 4 === 3 && <AttachFileIcon/>}
								{index % 4 === 2 && <SavedSearchIcon/>}
							</ListItemIcon>
							<ListItemText primary={text}/>
							{openIndex === index ? <ExpandLess/> : <ExpandMore/>}
						</ListItemButton>
						<Collapse in={openIndex === index} timeout="auto" unmountOnExit>
							{index % 4 === 0 && <ToDos/>}
						</Collapse>
					</ListItem>
				))}
			</List>
			<Divider/>
		</Drawer>
		<Main open={openMain}>
			<DrawerHeader/>
			{children}
		</Main>
	</>;
}

export default LeftDrawer;
