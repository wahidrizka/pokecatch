import { MyPokemonType, PokemonSummaryType } from "@/types/pokemon";

const MY_POKEMON_STORAGE_KEY = "pokecatch@myPokemon";

export const generatePokemonSummary = (
	pokemons: MyPokemonType[]
): PokemonSummaryType[] => {
	const capturedByName = new Map<string, number>();

	for (const pokemon of pokemons) {
		capturedByName.set(pokemon.name, (capturedByName.get(pokemon.name) ?? 0) + 1);
	}

	return Array.from(capturedByName, ([name, captured]) => ({ name, captured }));
};

export const loadMyPokemonFromLocalStorage = (): MyPokemonType[] => {
	if (typeof window === "undefined") return [];

	try {
		const rawPokemons = localStorage.getItem(MY_POKEMON_STORAGE_KEY);
		return rawPokemons ? JSON.parse(rawPokemons) : [];
	} catch (error) {
		console.error("Failed to parse data from localStorage:", error);
		return [];
	}
};

/**
 * Satu-satunya jalur tulis koleksi. Mengembalikan summary terbaru supaya pemanggil
 * bisa menyinkronkan GlobalContext dalam langkah yang sama — kedua sumber state
 * tidak boleh diperbarui terpisah.
 */
export const persistMyPokemon = (
	pokemons: MyPokemonType[]
): PokemonSummaryType[] => {
	localStorage.setItem(MY_POKEMON_STORAGE_KEY, JSON.stringify(pokemons));
	return generatePokemonSummary(pokemons);
};

// Ter-indentasi supaya file cadangannya enak dibaca manusia.
export const serializeMyPokemon = (pokemons: MyPokemonType[]) =>
	JSON.stringify(pokemons, null, 2);

/**
 * Memvalidasi isi file impor SEBELUM koleksi disentuh — melempar bila bentuknya
 * tidak sah, sehingga tidak pernah ada impor setengah jadi. Nickname duplikat di
 * dalam file: yang pertama menang. Nama dan nickname dinormalisasi UPPERCASE
 * mengikuti bentuk penyimpanan.
 */
export const parseMyPokemonFile = (text: string): MyPokemonType[] => {
	const raw: unknown = JSON.parse(text);
	if (!Array.isArray(raw)) throw new Error("collection file must be an array");

	const seen = new Set<string>();
	const entries: MyPokemonType[] = [];

	for (const item of raw) {
		if (typeof item !== "object" || item === null) {
			throw new Error("collection entry must be an object");
		}

		const { name, nickname, sprite, isShiny } = item as Record<string, unknown>;
		if (typeof name !== "string" || !name.trim()) {
			throw new Error("collection entry needs a name");
		}
		if (typeof nickname !== "string" || !nickname.trim()) {
			throw new Error("collection entry needs a nickname");
		}
		if (sprite !== undefined && typeof sprite !== "string") {
			throw new Error("sprite must be a string");
		}
		if (isShiny !== undefined && typeof isShiny !== "boolean") {
			throw new Error("isShiny must be a boolean");
		}

		const cleanNickname = nickname.trim().toUpperCase();
		if (seen.has(cleanNickname)) continue;
		seen.add(cleanNickname);

		entries.push({
			name: name.trim().toUpperCase(),
			nickname: cleanNickname,
			...(sprite !== undefined && { sprite }),
			...(isShiny !== undefined && { isShiny }),
		});
	}

	return entries;
};

/** Gabung dengan aturan lewati-tabrakan nickname; koleksi lama tak tersentuh. */
export const mergeCollections = (
	current: MyPokemonType[],
	incoming: MyPokemonType[]
) => {
	const taken = new Set(current.map((pokemon) => pokemon.nickname));
	const added = incoming.filter((pokemon) => !taken.has(pokemon.nickname));

	return {
		merged: [...current, ...added],
		added: added.length,
		skipped: incoming.length - added.length,
	};
};
