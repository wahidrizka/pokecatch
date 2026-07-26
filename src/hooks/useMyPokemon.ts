"use client";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context";
import { loadMyPokemonFromLocalStorage, persistMyPokemon } from "@/helpers";
import { MyPokemonType } from "@/types/pokemon";

/**
 * Satu-satunya pintu untuk mengubah koleksi. Menjaga localStorage dan
 * pokemonSummary di GlobalContext tidak pernah diperbarui terpisah.
 */
export const useMyPokemon = () => {
	const { setState } = useGlobalContext();
	const [pokemons, setPokemons] = useState<MyPokemonType[]>([]);

	useEffect(() => {
		setPokemons(loadMyPokemonFromLocalStorage());
	}, []);

	const commit = (next: MyPokemonType[]) => {
		setPokemons(next);
		setState({ pokemonSummary: persistMyPokemon(next) });
	};

	const release = (nickname: string) => {
		commit(pokemons.filter((pokemon) => pokemon.nickname !== nickname));
	};

	/**
	 * Mengembalikan false kalau nickname sudah dipakai. Koleksi dibaca ulang dari
	 * localStorage lebih dulu karena halaman penangkapan tidak menampilkannya,
	 * jadi state lokal di sana belum tentu yang terbaru.
	 */
	const keep = (entry: MyPokemonType) => {
		const collection = loadMyPokemonFromLocalStorage();

		if (collection.some((pokemon) => pokemon.nickname === entry.nickname)) {
			return false;
		}

		commit([...collection, entry]);
		return true;
	};

	return { pokemons, release, keep };
};
