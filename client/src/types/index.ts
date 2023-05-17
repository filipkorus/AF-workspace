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

export interface IWorkspaceMessage {
	_id: string,
	author: {
		_id: string,
		picture: string,
		name: string
	},
	content: string,
	createdAt: Date
}

export interface IWorkspaceSharedFile {
	_id: string,
	originalFilename: string,
	uniqueFilename: string,
	addedBy:  {
		_id: string,
		picture: string,
		name: string
	},
	addedAt: Date
}
