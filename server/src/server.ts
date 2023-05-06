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
import {logError, logInfo} from "./utils/logger";
import {SUCCESS} from './helpers/responses/messages';
import workspace from './models/workspace';

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
	logInfo(`[socket] ${socket.user.name} connected to server`);

	socket.emit('greeting-from-server', {
		msg: 'Hello Client'
	});

	socket.on('disconnect', () => logInfo(`[socket] ${socket.user.name} disconnected from server`));

	socket.on('join-workspace', room => {
		try {
			logInfo(`[socket] ${socket.user.name} joined room: ` + room);
			socket.join(room);
			socket.to(room).emit('user joined', socket.id);
		} catch (e) {
			logError(`[socket error] ${socket.user.name} joined room: ` + e);
			socket.emit('error', 'couldnt perform requested action');
		}

		// TODO: remove in production
		socket.on('msg', message => logInfo(`[socket] ${socket.user.name} sent msg to room "${room}": ${message}`));

		socket.on('send-changes', (delta) => {
			logInfo(`[socket] ${socket.user.name} sent "send-changes" to room "${room}"`)
			socket.to(room).emit('receive-changes', delta);
		});

		socket.on('get-document', () => {
			logInfo(`[socket] ${socket.user.name} sent "get-document" to room "${room}"`)
			socket.to(room).emit('load-document', 'this content has been fetched from server');
		});
	});

	socket.on('leave-workspace', room => {
		try {
			logInfo(`[socket] ${socket.user.name} left room: ` + room);
			socket.leave(room);
			socket.to(room).emit('user left', socket.id);
		} catch (e) {
			logError(`[socket error] ${socket.user.name} left room: ` + e);
			socket.emit('error', 'couldnt perform requested action');
		}
	})
});

// TODO: remove in production
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
