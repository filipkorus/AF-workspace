export default interface IWorkspaceAIChat {
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
