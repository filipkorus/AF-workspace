import {model, Schema} from 'mongoose';
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
	refreshTokens?: {
		token: string,
		createdAt: Date,
		expiresAt: Date
	}[]
}

const userSchema = new Schema<IUser>({
	email: {
		type: String,
		required: true,
		index: { unique: true }
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
	refreshTokens: [{
		token: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			default: new Date()
		},
		expiresAt: {
			type: Date,
			required: true
		}
	}]
});

const User = model('user', userSchema);

export default User;
