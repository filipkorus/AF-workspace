import IWorkspaceMessage from './IWorkspaceMessage';
import IWorkspaceTODO from './IWorkspaceTODO';
import IWorkspaceSharedFile from './IWorkspaceSharedFile';
import IWorkspaceAIChat from './IWorkspaceAIChat';
import IWorkspaceMember from './IWorkspaceMember';

export default interface IWorkspace {
	_id: string,
	content?: Object,
	name: string,
	createdBy: string,
	createdAt: Date,
	members?: IWorkspaceMember[],
	messages?: IWorkspaceMessage[],
	todos?: IWorkspaceTODO[],
	sharedFiles?: IWorkspaceSharedFile[]
	AIChat?: IWorkspaceAIChat[]
};
