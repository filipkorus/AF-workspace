import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {Alert, Box, Container, Grid, LinearProgress, Snackbar} from '@mui/material';
import {GoogleLogin} from '@react-oauth/google';
import theme from "../utils/theme";
import logo from "../assets/logo.png";
import {v4 as uuidv4} from 'uuid';
import {getUserWorkspaces} from '../api/workspace';
import IAuthContext from '../types/IAuthContext';

const Login = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const {login, currentUser} = useAuth() as IAuthContext;
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
		setError(error || '');
		setLoading(false);
	};

	const errorMessage = () => {
		setError('OAuth error');
		setLoading(false);
	};

	useEffect(() => {
		getUserWorkspaces()
			.then((workspaces: any) => {
				if (workspaces.length > 0) {
					navigate(`/workspace/${workspaces.at(-1)?._id}`)
					window.location.reload();
					return;
				}
			})
			.catch((error: any) => {});
	}, [navigate]);

	return <>
		<Container maxWidth={false} style={{
			backgroundColor: theme.palette.primary.main,
			height: '100vh',
			overflow: 'hidden'
		}}
		>
			{(loading && currentUser == null) &&
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
					{(!loading && currentUser == null) && <GoogleLogin onSuccess={responseMessage} onError={errorMessage}/>}
				</Box>

				{(error && currentUser == null) && <Box marginTop='2rem'>
                <Alert severity="error">{error}</Alert>
            </Box>}

			</Grid>
		</Container>

		{currentUser == null && <>
          <Snackbar open={isLoggedOut}>
              <Alert severity="success" onClose={() => setIsLoggedOut(false)}>Logged out successfully</Alert>
          </Snackbar>
          <Snackbar open={isKickedOut}>
              <Alert severity="warning" onClose={() => setIsKickedOut(false)}>Please log in</Alert>
          </Snackbar>
		</>}
	</>
};

export default Login;
