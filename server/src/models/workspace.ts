import {model, Schema} from 'mongoose';

interface IWorkspace {
	_id: string,
	content: Object,
	createdBy: string,
	createdAt: Date,
	members?: IWorkspaceMember[],
	messages?: IWorkspaceMessage[],
	todos?: IWorkspaceTODO[],
	sharedFiles?: IWorkspaceSharedFile[]
}

interface IWorkspaceMember {
	userId: string,
	isActive: boolean,
	lastTimeActive: Date,
	addedBy: string,
	addedAt: Date
}

interface IWorkspaceMessage {
	_id: string,
	userId: string,
	content: string,
	createdAt: Date
}

interface IWorkspaceTODO {
	_id: string,
	content: string,
	isDone: boolean,
	addedBy: string,
	addedAt: Date
}

interface IWorkspaceSharedFile {
	_id: string,
	originalFilename: string,
	uniqueFilename: string,
	addedBy: string,
	addedAt: Date
}

const workspaceSchema = new Schema<IWorkspace>({
	_id: {
		type: String,
	},
	content: {
		type: Object,
		required: true
	},
	createdBy: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
	members: [{
		userId: {
			type: String,
			required: true
		},
		addedBy: {
			type: String,
			required: true
		},
		addedAt: {
			type: Date,
			default: new Date()
		}
	}],
	messages: [{
		_id: {
			type: String
		},
		userId: {
			type: String,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			default: new Date()
		}
	}],
	todos: [{
		_id: {
			type: String
		},
		addedBy: {
			type: String,
			required: true
		},
		isDone: {
			type: Boolean,
			default: false
		},
		content: {
			type: String,
			required: true
		},
		addedAt: {
			type: Date,
			default: new Date()
		}
	}],
	sharedFiles: [{
		_id: {
			type: String
		},
		originalFilename: {
			type: String,
			required: true
		},
		uniqueFilename: {
			type: Boolean,
			default: false
		},
		addedBy: {
			type: String,
			required: true
		},
		addedAt: {
			type: Date,
			default: new Date()
		}
	}]
});
const Workspace = model('workspace', workspaceSchema);

export {
	IWorkspace,
	IWorkspaceTODO,
	IWorkspaceSharedFile,
	IWorkspaceMessage,
	IWorkspaceMember,
};

export default Workspace;
