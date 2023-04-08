import React, {useEffect, useRef, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import {Alert, Box, Container, Grid, LinearProgress, Snackbar, Stack} from '@mui/material';
import theme from "../utils/theme";
import logo from "../assets/logo.png";

const Login = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const {login, currentUser} : any = useAuth();
	const navigate = useNavigate();

	const google = (window as any).google || null; /* global google */
	const params = new URLSearchParams(window.location.search);
	const [isLoggedOut, setIsLoggedOut] = useState<boolean>(params.get('loggedOut') === 'true');
	const [isKickedOut, setIsKickedOut] = useState<boolean>(params.get('kickedOut') === 'true');

	useEffect(() => {
		if (!google) {
			return;
		}

		google.accounts.id.renderButton(document.getElementById("signInWithGoogleDiv"), {
			type: 'standard', // standard, icon
			theme: 'outline', // outline, filled_blue, filled_black
			size: 'large', // large, medium, small
			text: 'continue_with', // signin_with, signup_with, continue_with, signin
			shape: 'rectangular', // rectangular, pill, circle, square,
			// click_listener: () => console.log('clicked google')
		});

		const btn = document.getElementById("signInWithGoogleDiv");
		if (btn) {
			btn.style.width = '100%';
		}

		// google.accounts.id.prompt();

		google.accounts.id.initialize({
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
			auto_select: !isLoggedOut,
			callback: async (response: any) => {
				setError('');
				setIsLoggedOut(false);
				setIsKickedOut(false);
				setLoading(true);
				const {success, error} = await login(response.credential);
				if (success) {
					return navigate('/');
				}
				setError(error);
				setLoading(false);
			}
		});
	}, []); // runs onMount

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
						{!loading && <div id="signInWithGoogleDiv"></div>}
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
