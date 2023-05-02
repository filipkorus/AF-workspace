import * as React from 'react';
import {css, styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import QuillEditor from "./leftside/QuillEditor";
import {ChatBubbleOutline} from "@mui/icons-material";
import {useState} from "react";
import LeftDrawer from "./leftside/LeftDrawer";
import ChatInput from "./ChatInput";

const drawerWidth = 270;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
    open?: boolean;
}>(({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));
const RightDrawer = ({workspaceId}: any) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [messages, setMessages] = useState<string[]>([]);
    const handleSendMessage = (msg: {text: string, timestamp: string}) => {
        setMessages([...messages, msg.text]);
    };
    return (
        <Box sx={{display: 'flex'}}>

            <CssBaseline/>
            <AppBar position='fixed' open={open} style={{
                bottom: 0,
                right: 0,
                width: "50px",
                backgroundColor: theme.palette.secondary.main,
                border: "3px"
            }}>
                <Toolbar>
                    <IconButton
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{mr: 2, ...(open && {display: 'none'})}}
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
                anchor="right"
                open={open}
            >
                <DrawerHeader>
                    <MenuIcon/>
                    <IconButton onClick={handleDrawerClose}>

                        <p style={{fontSize: "16px", fontStyle: "oblique"}}> ID: {workspaceId} </p>
                        {theme.direction === 'ltr' ? <ChevronRightIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </DrawerHeader>

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
            </Drawer>
            <Main open={open}>
                {/*quilll cdodac msuze*/}

            </Main>
        </Box>

    );

};

export default RightDrawer;