export default interface IWorkspaceSharedFile {
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
