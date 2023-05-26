import IUser from './IUser';

export default interface IAuthContext {
	currentUser: IUser | null,
	login: (credential: string) => Promise<{ success: string | null, error: string | null }>,
	logout: () => Promise<{ success: string | null, error: string | null }>
};
