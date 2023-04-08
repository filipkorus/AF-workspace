export interface User {
	id: number,
	email: string,
	name: string,
	picture: string,
	role: string,
	admin: boolean,
	banned: boolean,
	joinedAt: Date
}
