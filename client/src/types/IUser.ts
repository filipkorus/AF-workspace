export default interface IUser {
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
