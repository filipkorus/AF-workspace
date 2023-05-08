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
import {findByIdAndUpdate, findOrCreateWorkspace} from './services/workspace/document.service';

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

	socket.on('disconnect', () => logInfo(`[socket] ${socket.user.name} disconnected from server`));

	socket.emit('greeting-from-server', {
		msg: 'Hello Client'
	});

	// TODO: remove in production
	socket.on('msg', message => logInfo(`[socket] ${socket.user.name} sent msg: ${message}`));

	socket.on('get-document', async (workspaceId: string) => {
		const workspace = await findOrCreateWorkspace(workspaceId, socket.user.id);

		if (workspace == null) {
			logInfo(`[socket] ${socket.user.name}: event = 'workspace-error'`);
			return socket.emit('workspace-error', {msg: 'You are not a member of this workspace', error: 'Not Authorized'});
		}
		socket.join(workspaceId);
		logInfo(`[socket] ${socket.user.name} joined workspace`);
		socket.emit('load-document', workspace.content);

		socket.on('send-changes', (delta) => {
			socket.to(workspaceId).emit('receive-changes', delta);
			// logInfo(`[socket] ${socket.user.name}: event = 'send-changes'`);
		});

		socket.on('save-document', async (data) => {
			await findByIdAndUpdate(workspaceId, data);
			// logInfo(`[socket] ${socket.user.name}: event = 'save-document'`);
		});
	});
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
