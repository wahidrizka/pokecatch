import {
	POKEMON_API,
	POKEMON_SPECIES_API,
	POKEMON_TYPE_API,
} from "@/configs/api";
import {
	AllPokemonResponseType,
	PokemonByTypeResponseType,
	PokemonDetailType,
	PokemonSpeciesResponseType,
} from "@/types/pokemon";
import axios from "axios";

/**
 * Kegagalan sengaja dilempar, bukan ditelan. Versi lama mengembalikan undefined
 * sehingga pemanggil tidak bisa membedakan "gagal" dari "kosong", dan halaman
 * hanya tampak kosong tanpa pesan apa pun.
 */

export const getAllPokemon = async (limit = 50, offset = 0) => {
	const { data } = await axios.get<AllPokemonResponseType>(POKEMON_API, {
		params: { limit, offset },
	});

	return data;
};

export const getDetailPokemon = async (name: string) => {
	const { data } = await axios.get<PokemonDetailType>(`${POKEMON_API}/${name}`);

	return data;
};

export const getPokemonSpecies = async (species: string) => {
	const { data } = await axios.get<PokemonSpeciesResponseType>(
		`${POKEMON_SPECIES_API}/${species}`
	);

	return data;
};

export const getPokemonByType = async (type: string) => {
	const { data } = await axios.get<PokemonByTypeResponseType>(
		`${POKEMON_TYPE_API}/${type}`
	);

	return data;
};
