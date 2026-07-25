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
