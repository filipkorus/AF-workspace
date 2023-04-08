import React from 'react';
import {Avatar, Box, Grid} from '@mui/material';
import theme from '../../utils/theme';
import {useParams} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import {useState} from "react";
import QuillEditor from "./QuillEditor";
import {Quill} from "react-quill";

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
            <p>You logged into workspace with ID {id}</p>
            Data for the currently logged in user: {JSON.stringify(currentUser)}
            <br/><br/>
            <Avatar
                alt={currentUser.name}
                src={currentUser.picture}
                sx={{width: 56, height: 56}}
            />
            <Box>
                {/*<QuillEditor/>*/}
            </Box>
        </Grid>
    );
};

export default Center;
