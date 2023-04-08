import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import {Alert, Box, Container, Grid, LinearProgress} from '@mui/material';
import {User} from '../types';

const Login = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const { login, currentUser } : any = useAuth();
	const navigate = useNavigate();

	const google = (window as any).google || null; /* global google */
	const params = new URLSearchParams(window.location.search);
	const isLoggedOut = params.get('loggedOut') === 'true';
	const isKickedOut = params.get('kickedOut') === 'true';

	useEffect(() => {
		if (!google) {
			return;
		}

		google.accounts.id.renderButton(document.getElementById("signInWithGoogleDiv"), {
			type: 'standard', // standard, icon
			theme: 'outline', // outline, filled_blue, filled_black
			size: 'large', // large, medium, small
			text: 'continue_with', // signin_with, signup_with, continue_with, signin
			shape: 'pill', // rectangular, pill, circle, square,
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
		<Navigate to="/" /> :
		<Container>
			{loading && <LinearProgress />}
			<Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '100vh' }}
			>

				<Grid item xs={3}>
					<Box
						sx={{
							backgroundColor: 'primary.dark',
						}}
					>
						{error && <Alert severity="error">{error}</Alert>}
						{!loading && <div id="signInWithGoogleDiv"></div>}
						{isLoggedOut && <Alert severity="success">Logged out successfully</Alert>}
						{isKickedOut && <Alert severity="warning">Please log in</Alert>}
					</Box>
				</Grid>

			</Grid>
		</Container>
};

export default Login;
