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
 */

export type AllPokemonResponseType = {
	count: number;
	next?: string;
	previous?: string;
	results: PokemonType[];
};

export type PokemonDetailType = {
	name: string;
	abilities: Array<{
		ability: {
			name: string;
			url: string;
		};
		is_hidden: boolean;
		slot: number;
	}>;
	moves: {
		move?: {
			name?: string;
			[other: string]: unknown;
		};
		[other: string]: unknown;
	}[];
	types: {
		type?: {
			name?: string;
			[other: string]: unknown;
		};
		[other: string]: unknown;
	}[];
	sprites: {
		front_default: string;
		versions?: {
			"generation-v"?: {
				"black-white"?: {
					animated?: {
						front_default: string;
					};
					[other: string]: unknown;
				};
			};
			[other: string]: unknown;
		};
		[other: string]: unknown;
	};
	stats: Array<{
		base_stat: number;
		effort?: number;
		stat: {
			name?: string;
			url: string;
		};
	}>;
	[other: string]: unknown;
};
