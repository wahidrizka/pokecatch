"use client";
import {
	generatePokemonSummary,
	loadMyPokemonFromLocalStorage,
} from "@/helpers";
import { PokemonSummaryType, PokemonType } from "@/types/pokemon";
import { useContext, createContext, useState } from "react";

type GlobalContextType = {
	state: StateType;
	/**
	 * Menggabung, tidak menimpa — Partial-nya menyatakan itu di tipe. Bidang yang
	 * tidak disebut tetap seperti semula.
	 */
	setState: (param: Partial<StateType>) => void;
};

/*
 * Kedua bidang wajib. initialState selalu mengisi keduanya dan setState hanya
 * menggabung, jadi tidak ada jalan bagi keduanya menjadi undefined; menandainya
 * opsional hanya memaksa pemanggil menulis penjagaan yang tak pernah terpicu.
 */
type StateType = {
	pokemonSummary: PokemonSummaryType[];
	pokemons: PokemonType[];
};

const initialState: StateType = {
	pokemonSummary: generatePokemonSummary(loadMyPokemonFromLocalStorage()),
	pokemons: [],
};

const GlobalContext = createContext<GlobalContextType>({
	state: initialState,
	setState: () => {},
});

export const useGlobalContext = () => {
	return useContext(GlobalContext);
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, setGlobalContext] = useState<StateType>(initialState);

	const setState = (param: Partial<StateType>) => {
		setGlobalContext((previous) => ({ ...previous, ...param }));
	};

	return (
		<GlobalContext.Provider value={{ state, setState }}>
			{children}
		</GlobalContext.Provider>
	);
};
