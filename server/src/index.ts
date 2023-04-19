import server from './server';
import {logInfo} from './utils/logger';
import config from 'config';
import {connectDB} from '../config/db';

const PORT = config.get<number>('PORT') || 3000;

connectDB()
	.then((msg: string) => server.listen(PORT, () => logInfo(`Server is running on port ${PORT}`)))
	.catch(error => process.exit(1));
