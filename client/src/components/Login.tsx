import React, {useEffect, useRef, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import {Alert, Box, Container, Grid, LinearProgress, Snackbar, Stack} from '@mui/material';
import {GoogleLogin} from '@react-oauth/google';
import theme from "../utils/theme";
import logo from "../assets/logo.png";
import {v4 as uuidv4} from 'uuid';

const Login = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const {login, currentUser, getUserWorkspaces}: any = useAuth();
	const navigate = useNavigate();

	const params = new URLSearchParams(window.location.search);
	const [isLoggedOut, setIsLoggedOut] = useState<boolean>(params.get('loggedOut') === 'true');
	const [isKickedOut, setIsKickedOut] = useState<boolean>(params.get('kickedOut') === 'true');

	const responseMessage = async (response: any) => {
		setError('');
		setIsLoggedOut(false);
		setIsKickedOut(false);
		setLoading(true);
		const {success, error} = await login(response.credential);
		if (success) {
			const workspaces = await getUserWorkspaces();

			navigate(`/workspace/${workspaces.length > 0 ? workspaces.at(-1)._id : uuidv4()}`);

			window.location.reload();
			return;
		}
		setError(error);
		setLoading(false);
	};

	const errorMessage = () => {
		setError('OAuth error');
		setLoading(false);
	};

	return currentUser ?
		<Navigate to="/"/> :
		<>
			<Container maxWidth={false} style={{
				backgroundColor: theme.palette.primary.main,
				height: '100vh',
				overflow: 'hidden'
			}}
			>
				{loading &&
                <LinearProgress color="secondary" sx={{position: 'absolute', top: 0, left: 0, width: '100vw'}}/>}

				<Grid
					container
					spacing={0}
					direction="column"
					alignItems="center"
					justifyContent="center"
					height="100%"
				>

					<img className="logo-animation" src={logo} alt="logo"/>

					<Box marginTop='2rem'>
						{!loading && <GoogleLogin onSuccess={responseMessage} onError={errorMessage}/>}
					</Box>

					{error && <Box marginTop='2rem'>
                   <Alert severity="error">{error}</Alert>
               </Box>}

				</Grid>
			</Container>

			<Snackbar open={isLoggedOut}>
				<Alert severity="success" onClose={() => setIsLoggedOut(false)}>Logged out successfully</Alert>
			</Snackbar>
			<Snackbar open={isKickedOut}>
				<Alert severity="warning" onClose={() => setIsKickedOut(false)}>Please log in</Alert>
			</Snackbar>
		</>
};

export default Login;
