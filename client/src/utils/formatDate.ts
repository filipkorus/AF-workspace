const formatDate = (date: Date | string) => {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = ('0' + (d.getMonth() + 1)).slice(-2); // miesiące są liczone od 0 do 11, więc dodajemy 1 i formatujemy zerem z przodu
	const day = ('0' + d.getDate()).slice(-2);
	const hours = ('0' + d.getHours()).slice(-2);
	const minutes = ('0' + d.getMinutes()).slice(-2);
	return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default formatDate;
