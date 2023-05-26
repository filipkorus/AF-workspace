export default interface IWorkspaceTODO {
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
