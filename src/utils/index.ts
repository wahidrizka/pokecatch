export const getPokemonId = (url: string) => {
	const urlSplit = url.split("/");
	if (urlSplit?.length) return urlSplit[urlSplit.length - 2];

	return "";
};
