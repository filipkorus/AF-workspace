import {PrismaClient, RefreshToken, User} from '@prisma/client';
import {compare, hash} from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import ROLE from '../../utils/roles.util';
import Mailer from '../../utils/mailer.util';
import {JwtPayload, Secret, sign, verify} from 'jsonwebtoken';
import fs from 'fs';
import config from 'config';
import {Email} from '../../utils/mailer.util';
import TOKEN from "../../helpers/tokens";
import {logError} from "../../utils/logger";
import {OAuth2Client, TokenPayload} from 'google-auth-library';

const prisma = new PrismaClient();

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
		return await prisma.user.count({where:{email}}) > 0;
	} catch (e) {
		return true;
	}
}

/**
 * Save user record in the database.
 *
 * @returns Boolean indicating success.
 * @param email {string} User's email.
 * @param name {string} User's name.
 * @param picture {string} User's picture URL.
 */
export const createUser = async ({email, name, picture}) : Promise<boolean> => {
	try {
		const created = await prisma.user.create({
			data: {
				email,
				name: name || '',
				picture: picture || '',
				role: ROLE.USER
			}
		});
		return created != null;
	} catch (e) {
		logError(e);
		return false;
	}
};

/**
 * Returns user with given email.
 *
 * @returns {Promise<User> | null} User object or null if error.
 * @param email {string} User's email.
 */
export const getUserByEmail = async (email: string) : Promise<User> | null => {
	try {
		return await prisma.user.findFirst({where:{email}});
	} catch (e) {
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
export const updateNameAndPicture = async (newName: string, newPicture: string, email: string) : Promise<boolean> => {
	try {
		await prisma.user.update({
			where:{email},
			data: {
				name: newName,
				picture: newPicture
			}
		});
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
export const generateRefreshToken = async (userId: number) => {
	const refreshToken = sign({
			id: userId
		},
		config.get<Secret>("REFRESH_TOKEN"),
		{expiresIn:config.get<string>("REFRESH_TOKEN_TTL")}
	);

	// save refresh token to DB
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7); // add 7 days to current time
	try {
		await prisma.refreshToken.create({
			data: {
				userId: userId,
				token: refreshToken,
				expiresAt
			}
		});
	} catch (e) {}

	return refreshToken;
};

/**
 * Returns refresh token object from the database.
 *
 * @returns Refresh token record or null if error.
 * @param userId {number} User's ID.
 */
export const getRefreshToken = async (userId: number) : Promise<RefreshToken> | null => {
	try {
		return await prisma.refreshToken.findFirst({
			where: {
				userId,
				expiresAt: {gte: new Date()}
			}
		});
	} catch (e) {
		return null;
	}
};

/**
 * Deletes refresh token from the database.
 *
 * @param refreshToken {string} JWT refresh token.
 */
export const deleteRefreshToken = async (refreshToken: string) : Promise<void> => {
	try {
		await prisma.refreshToken.delete({where:{token:refreshToken}});
	} catch (e) {}
}

/**
 * Deletes all expired refresh tokens from the database.
 */
export const deleteExpiredRefreshTokens = async () : Promise<void> => {
	try {
		await prisma.refreshToken.deleteMany({
			where:{expiresAt:{lt:new Date()}}
		});
	} catch (e) {}
};

/**
 * Generated JWT access token.
 *
 * @returns JWT access token.
 * @param userId
 */
export const generateAccessToken = (userId: number) : string => {
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
export const verifyToken = (token: string, accessOrRefresh: string) : string | JwtPayload | null => {
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
export const getUserById = async (userId: number) : Promise<User> | null => {
	try {
		return await prisma.user.findFirst({where:{id:userId}});
	} catch (e) {
		return null;
	}
};

/**
 *
 * @param oAuthToken {string} Google OAuth token.
 * @returns TokenPayload or null if error.
 */
export const verifyGoogleToken = async (oAuthToken: string) : Promise<TokenPayload | null> => {
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
