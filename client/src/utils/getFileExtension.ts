const getFileExtension = (filename: string) => {
	const parts = filename.split('.');
	return parts.length === 1 ? filename : parts[parts.length - 1];
};

export default getFileExtension;
