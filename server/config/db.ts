import mongoose from 'mongoose';
import config from 'config';
import {logError, logInfo} from '../src/utils/logger';

export const connect = async () => {
	try {
		const conn = await mongoose.connect(config.get<string>('MONGO_URI'));

		logInfo(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		logError(error);
		process.exit(1);
	}
}
