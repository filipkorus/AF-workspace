import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	debug: process.env.NODE_ENV !== 'production'
});

export default {
	USE_REQUEST_LOGGER: true,

	PORT: process.env.PORT || 3000,
	ORIGIN: process.env.ORIGIN?.split(';') || ['http://localhost:3000'],

	STATIC_FILES_DIR: path.resolve(process.env.NODE_ENV === 'production' ?
		'/app/public/' : '/var/www/nodejs-auth-api/'),

	QUILL_DOCUMENT_DEFAULT_VALUE: '',

	MONGO_URI: process.env.MONGO_URI,

	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

	ACCESS_TOKEN: process.env.ACCESS_TOKEN,
	ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,

	REFRESH_TOKEN: process.env.REFRESH_TOKEN,
	REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,

	MAX_AGE_TOKEN_COOKIE: process.env.MAX_AGE_TOKEN_COOKIE || 7 * 24 * 60 * 60 * 1000 // 7 days
};
