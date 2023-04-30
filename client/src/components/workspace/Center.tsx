import React, {useEffect} from 'react';
import {Avatar, Box, Button, Grid, LinearProgress} from '@mui/material';
import theme from '../../utils/theme';
import {useParams} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import {useState} from "react";
import QuillEditor from "./leftside/QuillEditor";

const Center = () => {
    const {id} = useParams();
    const {currentUser}: any = useAuth();

    const [value, setValue] = useState('');

    return (
        <Grid
            item
            xs={7}
            style={{
                backgroundColor: theme.palette.primary.main,
                height: "98%",
                justifyContent: 'stretch',
                alignItems: 'center',
                alignContent: "center"
            }}
        >
            {/*<Box style={{height: '99%'}}>*/}
            {/*   <QuillEditor disabled={disabled}/>*/}
            {/*</Box>*/}
        </Grid>
    );
};

export default Center;
