import {NextFunction, Request, Response} from 'express';
import {FORBIDDEN} from "../helpers/responses/messages";

/**
 * Role-based authorization - express middleware.
 *
 * @returns {function} Express middleware function.
 * @param roles {...list} Roles to be authorized.
 */
function requireRoles(...roles: string[]) {
	return (_: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(res.locals.user.role)) {
			return FORBIDDEN(res);
		}
		next();
	};
}

function requireSocketIORoles(...roles: string[]) {
	return (socket, next) => {
		if (!roles.includes(socket.user.role)) {
			return next(new Error('Authentication error'));
		}
		next();
	};
}

export default requireRoles;
