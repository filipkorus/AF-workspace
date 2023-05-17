import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import config from 'config';
import trimmer from './middleware/trimmer';
import {emailToLowerCase} from './middleware/emailToLowerCase';
import router from './routes/main.router';
import requestLogger from './middleware/requestLogger';
import {requireSocketIOAuth} from "./middleware/requireAuth";
import {logError, logInfo} from "./utils/logger";
import {SUCCESS} from './helpers/responses/messages';
import {
	findWorkspaceByIdAndUpdateContent,
	findOrCreateWorkspace, getAllWorkspacesByUserId,
} from './services/workspace/document.service';
import {getMessages, saveMessage} from './services/workspace/message.service';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import {writeFile} from 'fs';
import {removeSharedFile, saveSharedFile} from './services/workspace/sharedFile.service';

const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
	cors: {
		origin: config.get<string[]>('ORIGIN')
	},
	maxHttpBufferSize: config.get<number>('MAX_FILE_UPLOAD_SIZE_IN_BYTES')
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

	socket.on('disconnect', () => {
		logInfo(`[socket] ${socket.user.name} disconnected from server`);
		socket.user = null;
	});

	socket.emit('greeting-from-server', {msg: 'Hello Client'});

	socket.on('get-document', async (workspaceId: string) => {
		/* document */
		const workspace = await findOrCreateWorkspace(workspaceId, socket.user.id);

		if (workspace == null) {
			logInfo(`[socket] ${socket.user.name}: event = 'workspace-error'`);
			return socket.emit('workspace-error', {
				msg: 'You are not a member of this workspace',
				error: 'Not Authorized'
			});
		}
		socket.join(workspaceId);
		logInfo(`[socket] ${socket.user.name} joined workspace`);
		socket.emit('load-document', workspace.content);

		socket.on('send-changes', (delta) => {
			socket.to(workspaceId).emit('receive-changes', delta);
			// logInfo(`[socket] ${socket.user.name}: event = 'send-changes'`);
		});

		socket.on('save-document', async (data) => {
			await findWorkspaceByIdAndUpdateContent(workspaceId, data);
			// logInfo(`[socket] ${socket.user.name}: event = 'save-document'`);
		});

		/* messages */
		socket.on('get-messages', async () => {
			logInfo(`[socket] ${socket.user.name}: event = 'get-messages'`);
			const messages = await getMessages(workspaceId, socket.user.id);

			if (messages == null) {
				logInfo(`[socket] ${socket.user.name}: event = 'workspace-error'`);
				return socket.emit('workspace-error', {
					msg: 'You are not a member of this workspace',
					error: 'Not Authorized'
				});
			}
			socket.emit('load-messages', messages);
		});

		socket.on('send-message', async (msg) => {
			logInfo(`[socket] ${socket.user.name}: event = 'send-message'`);
			socket.to(workspaceId).emit('receive-message', {
				content: msg,
				createdAt: new Date(),
				author: {
					_id: socket.user.id,
					picture: socket.user.picture,
					name: socket.user.name
				},
				_id: uuidv4()
			});
			await saveMessage(workspaceId, socket.user.id, msg);
		});

		/* user's workspaces */
		socket.on('get-user-workspaces', async () => {
			logInfo(`[socket] ${socket.user.name}: event = 'get-user-workspaces'`);
			const workspaces = await getAllWorkspacesByUserId(socket.user.id);
			socket.emit('load-user-workspaces', workspaces);
		});

		/* shared files */
		socket.on('upload-file', (file, fileName, fileExtension, fileType, callback) => {
			logInfo(`[socket] ${socket.user.name}: event = 'upload-file'`);

			console.log(fileType);

			// console.log(file); // <Buffer 25 50 44 ...>

			const fileSize = Buffer.byteLength(file);
			if (fileSize > config.get<number>('MAX_FILE_UPLOAD_SIZE_IN_BYTES')) {
				return callback({
					success: false,
					msg: "File size exceeded",
					uniqueFilename: null
				});
			}

			if (!(config.get<string[]>('ALLOWED_FILE_EXTENSIONS').includes('*') || config.get<string[]>('ALLOWED_FILE_EXTENSIONS').includes(fileExtension))) {
				return callback({
					success: false,
					msg: "File type is not allowed!",
					uniqueFilename: null
				});
			}

			const uniqueFilename = uuidv4() + (fileExtension == null ? '' : '.') + fileExtension;
			const originalFilename = fileName;

			writeFile(path.join(config.get<string>('WORKSPACE_SHARED_FILES_DIR'), uniqueFilename), file, async (err) => {
				if (err == null) {
					// save file info into db
					await saveSharedFile({
						workspaceId,
						addedBy: socket.user.id,
						originalFilename,
						uniqueFilename,
						fileType
					});

					// emit changes to other rooms
					socket.to(workspaceId).emit('receive-file', {
						originalFilename,
						uniqueFilename,
						addedBy: {
							_id: socket.user.id,
							picture: socket.user.picture,
							name: socket.user.name
						},
						fileType,
						addedAt: new Date(),
						_id: uuidv4()
					});
				}

				if (err) {
					logError(err);
				}

				callback({
					success: err == null,
					msg: err ? "Server error occurred" : "File has been uploaded",
					uniqueFilename: err == null ? uniqueFilename : null
				});
			});
		});

		socket.on('remove-file', async (uniqueFilename, callback) => {
			logInfo(`[socket] ${socket.user.name}: event = 'remove-file'`);

			await removeSharedFile({
				workspaceId,
				uniqueFilename
			});

			socket.to(workspaceId).emit('remove-file', uniqueFilename);

			return callback({
				success: true,
				msg: "File has been removed"
			});
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
app.use('/', express.static(config.get<string>("STATIC_FILES_DIR")));
app.get('*', (req, res) => res.sendFile(path.resolve(config.get<string>("STATIC_FILES_DIR"), 'index.html')))

// export default app;
export default httpServer;
