export const POKEMON_API = process.env.NEXT_PUBLIC_POKEMON_API_URL || "";
export const POKEMON_IMAGE = process.env.NEXT_PUBLIC_POKEMON_IMAGE_URL || "";

/*
 * Diturunkan dari POKEMON_API (".../api/v2/pokemon" -> ".../api/v2/type"),
 * bukan env var baru: satu variabel yang salah konfigurasi sudah terbukti
 * membuat aplikasi gagal senyap, jangan menambah peluang kedua.
 */
export const POKEMON_TYPE_API = POKEMON_API.replace(/\/pokemon$/, "/type");
export const POKEMON_SPECIES_API = POKEMON_API.replace(
	/\/pokemon$/,
	"/pokemon-species"
);
