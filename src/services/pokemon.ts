import {
	POKEMON_API,
	POKEMON_EVOLUTION_API,
	POKEMON_SPECIES_API,
	POKEMON_TYPE_API,
} from "@/configs/api";
import {
	AllPokemonResponseType,
	EvolutionChainResponseType,
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

/**
 * Membedakan "tidak ada Pokemon bernama itu" dari "PokeAPI sedang bermasalah".
 * Tanpa ini, gangguan jaringan sesaat akan disajikan sebagai halaman 404 —
 * memberi tahu perayap bahwa halaman yang sebenarnya sah itu tidak ada.
 * Pengetahuan soal axios sengaja berhenti di lapisan ini.
 */
export const isNotFoundError = (error: unknown) =>
	axios.isAxiosError(error) && error.response?.status === 404;

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

export const getEvolutionChain = async (chainId: string) => {
	const { data } = await axios.get<EvolutionChainResponseType>(
		`${POKEMON_EVOLUTION_API}/${chainId}`
	);

	return data;
};

export const getPokemonByType = async (type: string) => {
	const { data } = await axios.get<PokemonByTypeResponseType>(
		`${POKEMON_TYPE_API}/${type}`
	);

	return data;
};
