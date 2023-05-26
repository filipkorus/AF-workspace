export default interface IWorkspaceMessage {
	_id: string,
	author: {
		_id: string,
		picture: string,
		name: string
	},
	content: string,
	createdAt: Date
}
