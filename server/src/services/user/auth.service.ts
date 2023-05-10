import {JwtPayload, Secret, sign, verify} from 'jsonwebtoken';
import config from 'config';
import TOKEN from "../../helpers/tokens";
import {logError} from "../../utils/logger";
import {OAuth2Client, TokenPayload} from 'google-auth-library';
import {HydratedDocument} from 'mongoose';
import User, {IUser} from '../../models/user';

const GOOGLE_CLIENT_ID = config.get<string>("GOOGLE_CLIENT_ID");
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Checks if email already exists.
 *
 * @returns {boolean} which indicates if email is already used.
 * @param email {string} Email to be checked.
 */
export const emailExists = async (email: string): Promise<boolean> => {
	try {
		return await User.findOne({email: new RegExp(email, 'i')}, {refreshTokens: 0, __v: 0}) !== null;
	} catch (e) {
		return true;
	}
}

/**
 * Saves user record in the database.
 *
 * @returns Boolean indicating success.
 * @param email {string} User's email.
 * @param name {string} User's name.
 * @param picture {string} User's picture URL.
 */
export const createUser = async ({email, name, picture}): Promise<boolean> => {
	try {
		const user: HydratedDocument<IUser> = await User.create({
			email, name, picture
		});
		return user != null;
	} catch (error) {
		logError(error);
		return false;
	}
};

/**
 * Returns user with given email.
 *
 * @returns {Promise<User> | null} User object or null if error.
 * @param email {string} User's email.
 */
export const getUserByEmail = async (email: string): Promise<IUser> | null => {
	try {
		return await User.findOne({email: new RegExp(email, 'i')}, {refreshTokens: 0, __v: 0});
	} catch (error) {
		return null;
	}
};

/**
 *
 * @param newName {string} Name to be updated.
 * @param newPicture {string} User's picture.
 * @param email {string} User's email.
 * @returns Boolean indicating success or not.
 */
export const updateNameAndPicture = async (newName: string, newPicture: string, email: string): Promise<boolean> => {
	try {
		await User.findOneAndUpdate(
			{email},
			{
				name: newName,
				picture: newPicture
			}
		);
		return true;
	} catch (e) {
		return false;
	}
};

/**
 * Generated JWT refresh token, saves it to the database and returns it.
 *
 * @returns {string} JWT refresh token.
 * @param userId {number} User's ID.
 */
export const generateRefreshToken = async (userId: string): Promise<string> => {
	const refreshToken = sign({
			_id: userId
		},
		config.get<Secret>("REFRESH_TOKEN"),
		{expiresIn: config.get<string>("REFRESH_TOKEN_TTL")}
	);

	// save refresh token to DB
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7); // add 7 days to current time
	try {
		await User.findOneAndUpdate(
			{_id: userId},
			{
				$push: {
					refreshTokens: {
						token: refreshToken,
						expiresAt
					}
				}
			}
		)
	} catch (error) {}

	return refreshToken;
};

/**
 * Returns boolean indicating if refresh token is valid.
 *
 * @returns Boolean indicating token validity.
 * @param token Refresh token.
 * @param userId {number} User's ID.
 */
export const isRefreshTokenValid = async (token: string, userId: string): Promise<boolean> => {
	try {
		return (await User.findOne({_id: userId}, {refreshTokens: 1}))?.refreshTokens.find(refreshToken => refreshToken.token === token && (new Date(refreshToken.expiresAt) > new Date())) != null;
	} catch (e) {
		return false;
	}
};

/**
 * Deletes refresh token from the database.
 *
 * @param refreshToken {string} JWT refresh token.
 */
export const deleteRefreshToken = async (refreshToken: string): Promise<void> => {
	try {
		await User.findOneAndUpdate(
			{},
			{$pull: {refreshTokens: {token: refreshToken}}}
		)
	} catch (error) {}
}

/**
 * Deletes all expired refresh tokens from the database.
 */
export const deleteExpiredRefreshTokens = async (): Promise<void> => {
	try {
		await User.updateMany(
			{},
			{$pull: {refreshTokens: {expiresAt: {"$lt": new Date()}}}}
		)
	} catch (error) {}
};

/**
 * Generated JWT access token.
 *
 * @returns JWT access token.
 * @param userId
 */
export const generateAccessToken = (userId: string): string => {
	return sign(
		{id: userId},
		config.get<string>("ACCESS_TOKEN"),
		{expiresIn: config.get<string>("ACCESS_TOKEN_TTL")}
	);
};

/**
 * Verifies JWT access or refresh token.
 *
 * @returns JWT payload.
 * @param token {string} JWT access or refresh token.
 * @param accessOrRefresh {string} Token type.
 */
export const verifyToken = (token: string, accessOrRefresh: string): string | JwtPayload | null => {
	try {
		return verify(token, config.get<string>(accessOrRefresh == TOKEN.REFRESH_TOKEN ? "REFRESH_TOKEN" : "ACCESS_TOKEN"));
	} catch (e) {
		return null;
	}
};

/**
 * Returns user object with given user ID.
 *
 * @returns User or null if error.
 * @param userId {number} User's ID.
 */
export const getUserById = async (userId: string): Promise<HydratedDocument<IUser>> | null => {
	try {
		return await User.findById(userId, {refreshTokens: 0, __v: 0});
	} catch (error) {
		return null;
	}
};

/**
 *
 * @param oAuthToken {string} Google OAuth token.
 * @returns TokenPayload or null if error.
 */
export const verifyGoogleToken = async (oAuthToken: string): Promise<TokenPayload | null> => {
	try {
		const ticket = await client.verifyIdToken({
			idToken: oAuthToken,
			audience: GOOGLE_CLIENT_ID,
		});
		return ticket.getPayload();
	} catch (error) {
		logError(error)
		return null;
	}
}
