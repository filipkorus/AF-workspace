import mongoose, { ConnectOptions } from 'mongoose';
import config from 'config';
import {logError, logInfo} from '../src/utils/logger';

export const connectDB = () => new Promise(async (resolve, reject) => {
	try {
		const conn = await mongoose.connect(config.get<string>('MONGO_URI'), {
			useNewUrlParser: true
		} as ConnectOptions);

		const msg = `MongoDB connected: ${conn.connection.host}`;

		logInfo(msg);
		resolve(msg);
	} catch (error) {
		logError(error);
		reject(error);
	}
});
