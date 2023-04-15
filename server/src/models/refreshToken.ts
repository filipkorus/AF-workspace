import {HydratedDocument, model, models, Schema} from 'mongoose';

export interface IRefreshToken {
	token: string,
	createdAt: Date,
	expiresAt: Date
}

export const refreshTokenSchema = new Schema<IRefreshToken>({
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
});

const RefreshToken = model('refreshToken', refreshTokenSchema);

export default RefreshToken;
