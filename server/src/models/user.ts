import {model, Schema} from 'mongoose';
import {IRefreshToken, refreshTokenSchema} from './refreshToken';
import ROLE from '../utils/roles.util';

export interface IUser {
	_id: string,
	email: string,
	name: string,
	picture: string,
	role: string,
	admin: boolean,
	banned: boolean,
	joinedAt: Date,
	refreshTokens?: IRefreshToken[]
}

const userSchema = new Schema<IUser>({
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	picture: {
		type: String,
		required: true
	},
	role: {
		type: String,
		default: ROLE.USER
	},
	admin: {
		type: Boolean,
		default: false
	},
	banned: {
		type: Boolean,
		default: false
	},
	joinedAt: {
		type: Date,
		default: new Date()
	},
	refreshTokens: [refreshTokenSchema]
});

const User = model('user', userSchema);

export default User;
