import {
    Drawer,
    CssBaseline,
    Toolbar,
    List,
    Divider,
    IconButton,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    AddTask as AddTaskIcon,
    AttachFile as AttachFileIcon,
    SavedSearch as SavedSearchIcon,
    ExpandLess,
    ExpandMore
} from "@mui/icons-material";
import ToDos from './ToDos';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../../../contexts/AuthContext';
import Main, {AppBar, DrawerHeader, drawerWidth} from '../Main';
import theme from "../../../utils/theme";
import DragnDrop from "./DragnDrop";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {useSocket} from '../../../contexts/SocketContext';
import WorkspaceList from './WorkspaceList';

const LeftDrawer = ({children}: { children?: JSX.Element }) => {
    const {socket, isConnected, isRoomJoined}: any = useSocket();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDragNDrop, setOpenDragNDrop] = useState(false);
    const [openAddTask, setOpenAddTask] = useState(false);
    const [openSavedWork, setOpenSavedWork] = useState(false);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const [open, setOpen] = useState(false);
    const handleClickDrag = () => {
        setOpenDragNDrop(!openDragNDrop);
    };
    const handleClickTask = () => {
        setOpenAddTask(!openAddTask);
    };
    const handleClickWork = () => {
        setOpenSavedWork(!openSavedWork);
    };
    const handleClick = () => {
        setOpen(!open);
    };

    const { currentUser, logout } : any = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const {success, error} = await logout();

        if (success) {
            if (socket != null) {
                socket.disconnect();
            }
            return navigate('/login?loggedOut=true');
        }

        alert(error || 'Failed to log out');
    }

    const [openMain, setOpenMain] = useState(false);

    const handleDrawerOpen = () => setOpenMain(true);
    const handleDrawerClose = () => setOpenMain(false);

    const {id: workspaceId} = useParams<string>();

    const [workspaces, setWorkspaces] = useState<[]>([]);
    useEffect(() => {
    	if (socket == null || !isRoomJoined) return;

    	socket.once('load-user-workspaces', (workspaces: []) => {
    		setWorkspaces(workspaces);
    	});

    	socket.emit('get-user-workspaces');
    }, [socket, isConnected, isRoomJoined, workspaceId]);

    return <>
        <CssBaseline/>
        <AppBar position="fixed" open={openMain}>
            <Toolbar style={{backgroundColor: theme.palette.primary.main}}>
                <IconButton
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{mr: 2, ...(openMain && {display: 'none'})}}
                >
                    <MenuIcon/>
                </IconButton>
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
                <ListItemButton onClick={handleLogout} style={{backgroundColor: theme.palette.primary.main, color: 'whitesmoke'}}>
                    <ListItemText primary="Logout" sx={{textAlign: 'center'}} />
                </ListItemButton>

                <ListItemButton onClick={handleClickWork}>
                    <ListItemIcon>
                        <SavedSearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="Your workspaces" />
                    {openSavedWork ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSavedWork} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <WorkspaceList workspaces={workspaces} />
                    </List>
                </Collapse>

                <ListItemButton onClick={handleClickDrag}>
                    <ListItemIcon>
                        <AttachFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drag n Drop" />
                    {openDragNDrop ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openDragNDrop} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton>
                            <DragnDrop/>
                        </ListItemButton>
                    </List>
                </Collapse>

                <ListItemButton onClick={handleClickTask}>
                    <ListItemIcon>
                        <AddTaskIcon/>
                    </ListItemIcon>
                    <ListItemText primary="TODO" />
                    {openAddTask ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openAddTask} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton>
                            <ToDos/>
                        </ListItemButton>
                    </List>
                </Collapse>

                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <SmartToyIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Ask AI/poll" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton>
                            tu tez nie
                        </ListItemButton>
                    </List>
                </Collapse>
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
