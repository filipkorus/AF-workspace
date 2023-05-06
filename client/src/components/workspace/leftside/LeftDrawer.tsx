import {
    Drawer,
    CssBaseline,
    Toolbar,
    List,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    AvatarGroup,
    Box,
    Collapse
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    AddTask as AddTaskIcon,
    Poll as PollIcon,
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
import StyledBadge from '../StyledBadge';
import theme from "../../../utils/theme";
import DragnDrop from "./DragnDrop";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {FileUploader} from "react-drag-drop-files";
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

    /**
     * Jak cos to ta funkcja jest niezaimplementowana - nie pobiera aktywnych uzytkownikow z serwera.
     */
    const getActiveUsers = () => {
        const avatars = [];
        for (let i = 0; i < 10; ++i) {
            avatars.push(
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
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
            <Toolbar style={{backgroundColor: theme.palette.primary.main}}>
                <IconButton
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{mr: 2, ...(openMain && {display: 'none'})}}
                >
                    <MenuIcon/>
                </IconButton>
                <Box sx={{marginLeft: '1rem'}}>
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
                    <ListItemText primary="tudu" />
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
