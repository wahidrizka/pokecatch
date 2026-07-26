export type MyPokemonType = {
	name: string;
	nickname: string;
	sprite?: string;
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

export type PokemonDetailType = {
	name: string;
	abilities: Array<{
		ability: { name: string; url: string };
		is_hidden: boolean;
		slot: number;
	}>;
	moves: Array<{ move: { name: string; url: string } }>;
	types: Array<{ slot: number; type: { name: string; url: string } }>;
	sprites: {
		front_default: string | null;
		other?: {
			showdown?: { front_default: string | null };
		};
	};
	stats: Array<{
		base_stat: number;
		effort: number;
		stat: { name: string; url: string };
	}>;
};
