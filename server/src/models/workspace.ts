import {model, Schema} from 'mongoose';

interface IWorkspace {
	_id: string,
	content: string,
	createdBy: string,
	createdAt: Date,
	members?: IWorkspaceMember[],
	messages?: IWorkspaceMessage[],
	todos?: IWorkspaceTODO[],
	sharedFiles?: IWorkspaceSharedFile[],
	polls?: IWorkspacePoll[]
}

interface IWorkspaceMember {
	userId: string,
	isActive: boolean,
	lastTimeActive: Date,
	addedBy: string,
	addedAt: Date
}

interface IWorkspaceMessage {
	userId: string,
	content: string,
	createdAt: Date
}

interface IWorkspaceTODO {
	content: string,
	isDone: boolean,
	addedBy: string,
	addedAt: Date
}

interface IWorkspaceSharedFile {
	originalFilename: string,
	uniqueFilename: string,
	addedBy: string,
	addedAt: Date
}

interface IWorkspacePoll {
	options: IWorkspacePollOption[],
	votes?: IWorkspacePollVote[]
	allowMultipleVotes: boolean,
	createdBy: string,
	createdAt: Date
	endAt: Date
}

interface IWorkspacePollOption {
	_id: string,
	title: string,
	description: string
}

interface IWorkspacePollVote {
	_id: string,
	optionId: string,
	createdBy: string,
	createdAt: Date
}

const workspacePollOptionSchema = new Schema<IWorkspacePollOption>({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	}
});
const WorkspacePollOption = model('workspacePollOption', workspacePollOptionSchema);

const workspacePollVoteSchema = new Schema<IWorkspacePollVote>({
	optionId: {
		type: String,
		required: true
	},
	createdBy: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
});
const WorkspacePollVote = model('workspacePollVote', workspacePollVoteSchema);

const workspaceSchema = new Schema<IWorkspace>({
	content: {
		type: String
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
		},
		select: false
	}],
	todos: [{
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
		},
		select: false
	}],
	sharedFiles: [{
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
		},
		select: false
	}],
	polls: [{
		options: [workspacePollOptionSchema],
		votes: [workspacePollVoteSchema],
		allowMultipleVotes: {
			type: Boolean,
			default: false
		},
		createdBy: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			default: new Date()
		},
		endAt: {
			type: Date,
			required: true
		},
		select: false
	}],
});
const Workspace = model('workspace', workspaceSchema);

export {
	IWorkspace,
	IWorkspacePoll,
	IWorkspaceTODO,
	IWorkspaceSharedFile,
	IWorkspaceMessage,
	IWorkspaceMember,
	IWorkspacePollVote,
	IWorkspacePollOption,

	WorkspacePollOption,
	WorkspacePollVote
};

export default Workspace;
