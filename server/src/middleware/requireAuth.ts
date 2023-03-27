import {getUserById, verifyToken} from '../services/user/auth.service';
import {ACCOUNT_BANNED, UNAUTHORIZED} from '../helpers/responses/messages';
import TOKEN from '../helpers/tokens';

/**
 * User authentication - express middleware.
 */
async function requireAuth (req, res, next) {
	const accessToken = req.header('Authorization')?.split(' ')[1] || '';
	const payload: any = verifyToken(accessToken, TOKEN.ACCESS_TOKEN);
	if (payload == null) {
		return UNAUTHORIZED(res);
	}

	const user = await getUserById(payload.id);
	if (user == null) {
		return UNAUTHORIZED(res);
	}

	if (user.banned){
		return ACCOUNT_BANNED(res);
	}

	res.locals.user = user;
	next();
}

export default requireAuth;
