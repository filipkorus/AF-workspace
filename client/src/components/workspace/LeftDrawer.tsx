import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AppBar from '@mui/material/AppBar';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import PollIcon from '@mui/icons-material/Poll';
import ListItem from '@mui/material/ListItem';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import theme from "../../utils/theme";

const drawerWidth = 240;

const LeftDrawer = () => {
    return (
        <Box sx={{display: 'flex'}}>
            {/*<CssBaseline />*/}
            {/*<AppBar*/}
            {/*    position="fixed"*/}
            {/*    sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}*/}
            {/*>*/}
            {/*</AppBar>*/}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,

                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: theme.palette.secondary.main,
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar/>
                <Divider/>
                <List>
                    {['To Dos', 'Voting', 'Saved work', 'Drag n Drop'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 4 === 1 && <AddTaskIcon/>}
                                    {index % 4 === 2 && <PollIcon/>}
                                    {index % 4 === 0 && <AttachFileIcon/>}
                                    {index % 4 === 3 && <SavedSearchIcon/>}
                                </ListItemIcon>

                                <ListItemText primary={text}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
            </Drawer>

        </Box>
    );
}
export default LeftDrawer;