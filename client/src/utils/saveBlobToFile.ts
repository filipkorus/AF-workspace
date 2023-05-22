const saveBlobToFile = ({blob, fileName}: {
	blob: Blob,
	fileName: string
}) => {
	const a = document.createElement('a');
	const url = URL.createObjectURL(blob);

	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
};

export default saveBlobToFile;
