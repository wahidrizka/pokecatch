export type MyPokemonType = {
	name: string;
	nickname: string;
	sprite?: string;
	// Opsional agar koleksi lama tetap terbaca tanpa migrasi: absen = bukan shiny.
	isShiny?: boolean;
};

export type PokemonType = {
	name: string;
	captured?: number;
	url?: string;
	sprite?: string;
};

export type PokemonSummaryType = {
	name: string;
	captured: number;
};

/**
 * Pokemon API Response
 *
 * Hanya bidang yang benar-benar dibaca aplikasi yang dideklarasikan. PokeAPI
 * mengembalikan jauh lebih banyak; menambah bidang di sini berarti ada kode
 * baru yang memakainya.
 */

export type AllPokemonResponseType = {
	count: number;
	next: string | null;
	previous: string | null;
	results: PokemonType[];
};

export type PokemonByTypeResponseType = {
	pokemon: Array<{ pokemon: PokemonType; slot: number }>;
};

export type PokemonSpeciesResponseType = {
	capture_rate: number;
};

export type PokemonDetailType = {
	name: string;
	abilities: Array<{
		ability: { name: string; url: string };
		is_hidden: boolean;
		slot: number;
	}>;
	moves: Array<{ move: { name: string; url: string } }>;
	types: Array<{ slot: number; type: { name: string; url: string } }>;
	// Nama spesies dasar — bentuk khusus (mega/gmax) menunjuk ke spesies induknya.
	species: { name: string; url: string };
	sprites: {
		front_default: string | null;
		front_shiny: string | null;
		other?: {
			showdown?: {
				front_default: string | null;
				front_shiny: string | null;
			};
		};
	};
	stats: Array<{
		base_stat: number;
		effort: number;
		stat: { name: string; url: string };
	}>;
};
