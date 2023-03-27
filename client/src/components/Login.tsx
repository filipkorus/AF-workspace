import {useContext, useEffect, useState} from "react";
import AuthContext from "../utils/auth/AuthContext";

const Login = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const {googleAuthLogin} : any = useContext(AuthContext);

	const google = (window as any).google || null; /* global google */
	const params = new URLSearchParams(window.location.search);
	const loggedOut = params.get('loggedOut') === 'true';

	useEffect(() => {
		if (!google) {
			return;
		}

		google.accounts.id.renderButton(document.getElementById("signInWithGoogleDiv"), {
			type: 'standard', // standard, icon
			theme: 'outline', // outline, filled_blue, filled_black
			size: 'large', // large, medium, small
			text: 'signin', // signin_with, signup_with, continue_with, signin
			shape: 'pill', // rectangular, pill, circle, square,
			// click_listener: () => console.log('clicked google')
		});

		// google.accounts.id.prompt();

		google.accounts.id.initialize({
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
			auto_select: !loggedOut,
			callback: (response : any) => googleAuthLogin({setLoading, setError, response })
		});
	}, []); // runs onMount

	return <>
		<main
			style={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{loading ? <div>Loading...</div> : <div id="signInWithGoogleDiv"></div>}
			{loggedOut && <p>Logged out successfully</p>}
		</main>
	</>;
};

export default Login;
