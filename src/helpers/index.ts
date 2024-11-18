import { MyPokemonType, PokemonSummaryType } from "@/types/pokemon";

export const generatePokemonSummary = (
	pokemons: MyPokemonType[]
): PokemonSummaryType[] => {
	const results: { name: string; captured: number }[] = [];

	pokemons.forEach((pokemon, idx) => {
		let pokemonExists = false;

		if (idx === 0) {
			results.push({ name: pokemon.name, captured: 1 });
		} else {
			for (const result of results) {
				if (result.name === pokemon.name) {
					pokemonExists = true;
				}
			}

			if (pokemonExists) {
				const pokemonIdx = results.findIndex((el) => el.name === pokemon.name);
				results[pokemonIdx].captured++;
			} else {
				results.push({ name: pokemon.name, captured: 1 });
			}
		}
	});

	return results;
};

export const loadMyPokemonFromLocalStorage = (): MyPokemonType[] => {
	if (typeof window === "undefined") {
		return [];
	}

	const rawPokemons = localStorage.getItem("pokecatch@myPokemon");
	try {
		return rawPokemons ? JSON.parse(rawPokemons) : [];
	} catch (error) {
		console.error("Failed to parse data from localStorage:", error);
		return [];
	}
};
