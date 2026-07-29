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
export const POKEMON_EVOLUTION_API = POKEMON_API.replace(
	/\/pokemon$/,
	"/evolution-chain"
);

/*
 * Artwork resmi 475x475, dipakai sebagai gambar og:image — sprite 96x96 terlalu
 * kecil untuk pratinjau tautan. Cakupannya sama persis dengan sprite biasa
 * (id 1-1025 dan 10001+), jadi setiap Pokemon yang bisa dibuka aplikasi ini
 * dipastikan punya artwork-nya.
 */
export const POKEMON_ARTWORK_IMAGE = `${POKEMON_IMAGE}/other/official-artwork`;
