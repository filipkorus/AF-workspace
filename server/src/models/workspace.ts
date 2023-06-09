import {model, Schema} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IWorkspace {
	_id: string,
	content: Object,
	name: string,
	createdBy: string,
	createdAt: Date,
	members?: IWorkspaceMember[],
	messages?: IWorkspaceMessage[],
	todos?: IWorkspaceTODO[],
	sharedFiles?: IWorkspaceSharedFile[]
	AIChat?: IWorkspaceAIChat[]
}

interface IWorkspaceMember {
	userId: string,
	addedBy: string,
	addedAt: Date
}

interface IWorkspaceMessage {
	_id: string,
	author: {
		_id: string,
		picture: string,
		name: string
	},
	content: string,
	createdAt: Date
}

interface IWorkspaceTODO {
	_id: string,
	content: string,
	isDone: boolean,
	addedBy: {
		_id: string,
		picture: string,
		name: string
	},
	addedAt: Date
}

interface IWorkspaceSharedFile {
	_id: string,
	originalFilename: string,
	uniqueFilename: string,
	addedBy:  {
		_id: string,
		picture: string,
		name: string
	},
	addedAt: Date
}

interface IWorkspaceAIChat {
	_id: string,
	content: string,
	role: 'user' | 'assistant',
	author?: {
		_id: string,
		picture: string,
		name: string
	},
	addedAt: Date
}

const workspaceSchema = new Schema<IWorkspace>({
	_id: {
		type: String
	},
	content: {
		type: Object,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	createdBy: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	members: [{
		userId: {
			type: String
		},
		addedBy: {
			type: String,
			required: true
		},
		addedAt: {
			type: Date,
			default: Date.now
		}
	}],
	messages: [{
		_id: {
			type: String,
			default: uuidv4
		},
		userId: {
			type: String,
			required: true,
			ref: 'user'
		},
		content: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	}],
	todos: [{
		_id: {
			type: String,
			default: uuidv4
		},
		content: {
			type: String,
			required: true
		},
		isDone: {
			type: Boolean,
			default: false
		},
		addedBy: {
			type: String,
			required: true,
			ref: 'user'
		},
		addedAt: {
			type: Date,
			default: Date.now
		}
	}],
	sharedFiles: [{
		_id: {
			type: String,
			default: uuidv4
		},
		originalFilename: {
			type: String,
			required: true
		},
		uniqueFilename: {
			type: String,
			required: true
		},
		addedBy: {
			type: String,
			required: true,
			ref: 'user'
		},
		addedAt: {
			type: Date,
			default: Date.now
		}
	}],
	AIChat: [{
		_id: {
			type: String,
			default: uuidv4
		},
		content: {
			type: String,
			required: true
		},
		role: {
			type: String,
			required: true
		},
		addedBy: {
			type: String,
			ref: 'user'
		},
		addedAt: {
			type: Date,
			default: Date.now
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
	IWorkspaceAIChat
};

export default Workspace;
