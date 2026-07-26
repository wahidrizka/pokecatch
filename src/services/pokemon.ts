import { POKEMON_API } from "@/configs/api";
import { AllPokemonResponseType, PokemonDetailType } from "@/types/pokemon";
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
