"use client";
import {
	generatePokemonSummary,
	loadMyPokemonFromLocalStorage,
} from "@/helpers";
import { PokemonSummaryType, PokemonType } from "@/types/pokemon";
import { useContext, createContext, useState } from "react";

type GlobalContextType = {
	state: StateType;
	setState: (param: StateType) => void;
};

type StateType = {
	pokemonSummary?: PokemonSummaryType[];
	pokemons?: PokemonType[];
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

	const setState = (param: StateType) => {
		setGlobalContext({ ...state, ...param });
	};

	return (
		<GlobalContext.Provider value={{ state, setState }}>
			{children}
		</GlobalContext.Provider>
	);
};
