import React from 'react';
import {Avatar, Box, Button, Divider, Grid, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import theme from '../../utils/theme';
import LeftDrawer from "./LeftDrawer";

const LeftSide = () => {
    return <Grid item xs={2} style={{}}>
        <Box>
            <LeftDrawer/>
        </Box>
    </Grid>;
};

export default LeftSide;
