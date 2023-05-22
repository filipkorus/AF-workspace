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
    Article as ArticleIcon,
    SmartToy as SmartToyIcon,
    ExpandLess,
    ExpandMore
} from "@mui/icons-material";
import ToDoList from './ToDoList';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../../../contexts/AuthContext';
import Main, {AppBar, DrawerHeader, drawerWidth} from '../Main';
import theme from "../../../utils/theme";
import DragnDrop from "./DragnDrop";
import {Typography} from '@mui/material';
import {useSocket} from '../../../contexts/SocketContext';
import WorkspaceList from './WorkspaceList';
import {getSharedFiles, getUserWorkspaces} from '../../../api/workspace';
import AddUserToWorkspace from './AddUserToWorkspace';
import RemoveUserFromWorkspace from './RemoveUserFromWorkspace';
import {IWorkspaceSharedFile, IWorkspaceTODO} from '../../../types';
import AIChat from './AIChat';

const LeftDrawer = ({children}: { children?: JSX.Element }) => {
    const {socket, isConnected, isRoomJoined}: any = useSocket();

    const [openDragNDrop, setOpenDragNDrop] = useState(false);
    const [openAddTask, setOpenAddTask] = useState(false);
    const [openSavedWork, setOpenSavedWork] = useState(false);
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

    const {currentUser, logout}: any = useAuth();
    const navigate = useNavigate();
    const handleSendToDo = (text: string) => {
    }
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

    const [workspaces, setWorkspaces] = useState<[]>([]);
    useEffect(() => {
    	if (socket == null || !isRoomJoined) return;

        getUserWorkspaces()
           .then((_workspaces: any) => setWorkspaces(_workspaces))
           .catch((error: any) => {});
    }, [socket, isConnected, isRoomJoined]);

    const [sharedFiles, setSharedFiles] = useState<IWorkspaceSharedFile[]>([]);
    useEffect(() => {
        if (socket == null || !isRoomJoined) return;

        getSharedFiles(workspaceId as string)
           .then((_sharedFiles: IWorkspaceSharedFile[]) => setSharedFiles(_sharedFiles))
           .catch((error: any) => {});
    }, [socket, isConnected, isRoomJoined]);

    const [todos, setTodos] = useState<IWorkspaceTODO[]>([]);
    useEffect(() => {
        if (socket == null || !isRoomJoined) return;

        socket.once('load-todos', (todos: IWorkspaceTODO[]) => {
           setTodos(todos);
        });

        socket.emit('get-todos');
    }, [socket, isConnected, isRoomJoined]);

    const {id: workspaceId} = useParams<string>();
    const workspaceName = (workspaces.find((workspace: any) => workspace?._id === workspaceId) as any)?.name || '';

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
                <AddUserToWorkspace workspaceName={workspaceName}/>
                <RemoveUserFromWorkspace workspaceName={workspaceName}/>
                <Typography variant="h6" noWrap component="div">
                    {workspaceName}
                </Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                }
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
                        <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Your workspaces" />
                    {openSavedWork ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSavedWork} timeout="auto">
                    <List component="div" disablePadding>
                        <WorkspaceList workspaces={workspaces} setWorkspaces={setWorkspaces} />
                    </List>
                </Collapse>

                <ListItemButton onClick={handleClickDrag}>
                    <ListItemIcon>
                        <AttachFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drag & Drop" />
                    {openDragNDrop ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openDragNDrop} timeout="auto">
                    <List component="div" disablePadding>
                        <DragnDrop sharedFiles={sharedFiles} setSharedFiles={setSharedFiles}/>
                    </List>
                </Collapse>

                <ListItemButton onClick={handleClickTask}>
                    <ListItemIcon>
                        <AddTaskIcon/>
                    </ListItemIcon>
                    <ListItemText primary="TODO" />
                    {openAddTask ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openAddTask} timeout="auto">
                    <List component="div" disablePadding>
                        <ToDoList todos={todos} setTodos={setTodos}/>
                    </List>
                </Collapse>

                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <SmartToyIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Ask AI" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto">
                    <List component="div" disablePadding>
                        <AIChat/>
                    </List>
                </Collapse>

                <ListItemButton onClick={() => {
                    navigate('/workspace');
                    window.location.reload();
                }} style={{backgroundColor: theme.palette.primary.main, color: 'whitesmoke'}}>
                    <ListItemText primary="Create new workspace" sx={{textAlign: 'center'}} />
                </ListItemButton>
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
