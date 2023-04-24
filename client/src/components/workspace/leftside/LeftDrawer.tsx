import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AddTaskIcon from '@mui/icons-material/AddTask';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import PollIcon from '@mui/icons-material/Poll';
import ListItem from '@mui/material/ListItem';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import theme from "../../../utils/theme";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import Collapse from '@mui/material/Collapse';
import ToDos from "./ToDos";
import QuillEditor from "../QuillEditor";
import {useState} from "react";
import {LinearProgress} from "@mui/material";

const drawerWidth = 240;
interface Props {
    window?: () => Window;
}
const LeftDrawer = (props:Props) => {


    const [openIndex, setOpenIndex] = React.useState(-1);
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [disabled, setDisabled] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleClick = (index:any) => {
        if (openIndex === index) {
            setOpenIndex(-1);
        } else {
            setOpenIndex(index);
        }
    };
    const MostLeft=(<Box sx={{ display: 'flex' }}>
        <Drawer
            sx={{
                color:'inherit',
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
            <Toolbar />
            <List>
                {['To Dos', 'Voting', 'Saved work', 'Drag n Drop'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => handleClick(index)}>
                            <ListItemIcon>
                                {index % 4 === 0 && <AddTaskIcon />}
                                {index % 4 === 1 && <PollIcon />}
                                {index % 4 === 3 && <AttachFileIcon />}
                                {index % 4 === 2 && <SavedSearchIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                            {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                            {index % 4 === 0 && <ToDos />}
                        </Collapse>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    </Box>);
    const container = window !== undefined ? () => window().document.body : undefined;

    return ( <Box sx={{ display: 'flex' }}>

            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                </IconButton>
            </Toolbar>
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,textAlign: 'left' },
                }}
            >
                {MostLeft}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth},
                }}
                open
            >
                {MostLeft}
            </Drawer>
        </Box>
        <Box component="main"
             sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center',alignItems: 'flex-start' }}
        >
            <Toolbar />
            <Box component="main"

                 style={{
                     // maxHeight:"100vh",
                     maxWidth:"100vw",
                 }}>
                <QuillEditor disabled={disabled}/>
            </Box>

        </Box>
    </Box>);
}
export default LeftDrawer;