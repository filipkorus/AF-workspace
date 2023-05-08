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
import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAuth} from '../../../contexts/AuthContext';
import Main, {AppBar, DrawerHeader, drawerWidth} from '../Main';
import theme from "../../../utils/theme";
import DragnDrop from "./DragnDrop";
import SmartToyIcon from '@mui/icons-material/SmartToy';

const LeftDrawer = ({children}: { children?: JSX.Element }) => {
    // const [openIndex, setOpenIndex] = useState(false);
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


    const [openMain, setOpenMain] = useState(false);

    const handleDrawerOpen = () => setOpenMain(true);
    const handleDrawerClose = () => setOpenMain(false);

    const {id: workspaceId} = useParams<string>();
    const {currentUser}: any = useAuth();

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
                {/*PRZERWA PRZCYISK*/}
                <ListItemButton onClick={handleClickTask}>
                    <ListItemIcon>
                        <AddTaskIcon/>
                    </ListItemIcon>
                    <ListItemText primary="To Do List" />
                    {openAddTask ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openAddTask} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton>
                            <ToDos/>
                        </ListItemButton>
                    </List>
                </Collapse>
                {/*slslsl*/}
                <ListItemButton onClick={handleClickWork}>
                    <ListItemIcon>
                        <SavedSearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="Saved work" />
                    {openSavedWork ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSavedWork} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton>
                            tu jeszcze nicnie ma
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
