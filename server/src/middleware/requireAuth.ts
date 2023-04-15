import {getUserById, verifyToken} from '../services/user/auth.service';
import {ACCOUNT_BANNED, UNAUTHORIZED} from '../helpers/responses/messages';
import TOKEN from '../helpers/tokens';
import {logInfo} from "../utils/logger";
import {HydratedDocument} from 'mongoose';
import {IUser} from '../models/user';
import {JwtPayload} from 'jsonwebtoken';

/**
 * User authentication - express middleware.
 */
async function requireAuth (req, res, next) {
	const accessToken = req.header('Authorization')?.split(' ')[1] || '';
	const payload: any = verifyToken(accessToken, TOKEN.ACCESS_TOKEN);
	if (payload == null) {
		return UNAUTHORIZED(res);
	}

	const user: IUser = await getUserById(payload.id);
	if (user == null) {
		return UNAUTHORIZED(res);
	}

	if (user.banned){
		return ACCOUNT_BANNED(res);
	}

	res.locals.user = user;
	next();
}

async function requireSocketIOAuth (socket, next) {
	const accessToken = socket.handshake?.auth?.token || '';
	const payload: any = verifyToken(accessToken, TOKEN.ACCESS_TOKEN);

	if (payload == null) {
		return next(new Error('Authentication error'));
	}

	const user: IUser = await getUserById(payload.id);
	if (user == null) {
		return next(new Error('Authentication error'));
	}

	if (user.banned){
		return next(new Error('Authentication error'));
	}

	socket.user = user;
	next();
}

export {
	requireSocketIOAuth
};

export default requireAuth;
