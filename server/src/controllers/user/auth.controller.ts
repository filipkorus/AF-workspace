import {
	emailExists, createUser, getUserByEmail, generateRefreshToken,
	generateAccessToken, deleteRefreshToken, verifyToken,
	isRefreshTokenValid, deleteExpiredRefreshTokens, verifyGoogleToken, updateNameAndPicture
} from '../../services/user/auth.service';
import config from 'config';
import TOKEN from '../../helpers/tokens';
import {
	ACCOUNT_BANNED, BAD_REQUEST, RESPONSE,
	INVALID_LOGIN_CREDENTIALS, UNAUTHORIZED, ACCOUNT_CREATED, SUCCESS
} from '../../helpers/responses/messages';
import {deleteWorkspaceById} from '../../services/workspace/document.service';

export const LoginHandler = async (req, res) => {
	await deleteExpiredRefreshTokens();

	const {credential} = req.body;

	if (!credential) {
		return BAD_REQUEST(res);
	}

	const profile = await verifyGoogleToken(credential);
	if (!profile) {
		return INVALID_LOGIN_CREDENTIALS(res);
	}

	let firstLogin = false;
	// user not found in DB
	if (!(await emailExists(profile.email))) {
		firstLogin = true;
		if (!(await createUser({
			email: profile.email,
			name: profile?.name,
			picture: profile?.picture
		}))) {
			return RESPONSE(res, 'Something went wrong! Account has not been created', 400);
		}
	}

	await updateNameAndPicture(profile?.name, profile?.picture, profile.email); // update name in db if changed

	const user = await getUserByEmail(profile.email);

	if (user.banned) {
		return ACCOUNT_BANNED(res);
	}

	const refreshToken = await generateRefreshToken(user._id);
	res.cookie(TOKEN.REFRESH_TOKEN, refreshToken, {
		httpOnly: true,
		maxAge: config.get<number>('MAX_AGE_TOKEN_COOKIE'),
		sameSite: 'strict'
	});

	const accessToken = generateAccessToken(user._id);

	const data = {
		token: accessToken,
		user
	};

	return firstLogin ?
		ACCOUNT_CREATED(res, data) :
		RESPONSE(res, 'User logged successfully', 200, data);
};

export const RefreshTokenHandler = async (req, res) => {
	const refreshToken = req.cookies[TOKEN.REFRESH_TOKEN];
	if (refreshToken == null) {
		return UNAUTHORIZED(res);
	}

	const payload: any = verifyToken(refreshToken, TOKEN.REFRESH_TOKEN);
	if (payload == null) {
		return UNAUTHORIZED(res);
	}

	if (!(await isRefreshTokenValid(refreshToken, payload._id))) {
		return UNAUTHORIZED(res);
	}

	const newAccessToken = generateAccessToken(payload._id);

	return RESPONSE(res, 'Access token has been refreshed', 200, {token: newAccessToken});
};

export const LogoutHandler = async (req, res) => {
	const refreshToken = req.cookies[TOKEN.REFRESH_TOKEN];

	await deleteRefreshToken(refreshToken); // delete refresh token from DB
	res.cookie(TOKEN.REFRESH_TOKEN, '', {maxAge:0}); // delete http-only cookie refresh token

	return RESPONSE(res, 'Logged out successfully', 200);
};

export const GetUserHandler = async (_, res) => {
	return SUCCESS(res, {user:res.locals.user});
};
