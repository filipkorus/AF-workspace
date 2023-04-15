import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import config from 'config';
import trimmer from './middleware/trimmer';
import {emailToLowerCase} from './middleware/emailToLowerCase';
import router from './routes/main.router';
import requestLogger from './middleware/requestLogger';
import {requireSocketIOAuth} from "./middleware/requireAuth";
import {logInfo} from "./utils/logger";
import {SUCCESS} from './helpers/responses/messages';

const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
	cors: {
		origin: config.get<string[]>('ORIGIN')
	}
});

app.use(cors({
	origin: config.get<string[]>('ORIGIN'),
	credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: '/tmp/'
}));

app.use(requestLogger);
app.use(trimmer);
app.use(emailToLowerCase);

app.use('/api', router);

io.use(requireSocketIOAuth);
io.on('connection', socket => {
	logInfo(`${socket.user.name} (socket.id=${socket.id}) connected to socket server`);

	socket.emit('greeting-from-server', {
		msg: 'Hello Client'
	});

	socket.on('disconnect', () => logInfo(`${socket.user.name} (socket.id=${socket.id}) disconnected from socket server`));

	socket.on('msg', message => logInfo(`${socket.user.name} (socket.id=${socket.id}) sent message: ${message}`));
});

// endpoint for testing purposes
app.get('/mdb', async (req, res) => {
	return SUCCESS(res, {
		testing: true
	})
})

/* SERVE STATIC FILES (FRONTEND) */
// app.use('/', express.static(config.get<string>("STATIC_FILES_DIR")));
// app.get('*', (req, res) => res.sendFile(path.resolve(config.get<string>("STATIC_FILES_DIR"), 'index.html')))

// export default app;
export default httpServer;
