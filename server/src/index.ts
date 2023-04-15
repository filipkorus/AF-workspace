import server from './server';
import {logError, logInfo} from './utils/logger';
import config from 'config';
import mongoose from 'mongoose';
import {connect} from '../config/db';

const PORT = config.get<number>('PORT') || 3000;

connect();

server.listen(PORT, () => logInfo(`Server is running on port ${PORT}`));
