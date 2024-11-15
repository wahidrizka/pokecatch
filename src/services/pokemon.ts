import { POKEMON_API } from "@/configs/api";
import { AllPokemonResponseType } from "@/types/pokemon";
import axios from "axios";

export const getAllPokemon = async (limit: number = 50, offset: number = 0) => {
	try {
		const response = await axios.get<AllPokemonResponseType>(POKEMON_API, {
			params: { limit: limit, offset: offset },
		});

		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const getDetailPokemon = async (name: string = "") => {
	try {
		const response = await axios.get(`${POKEMON_API}/${name}`);

		return response.data;
	} catch (error) {
		console.error(error);
	}
};
