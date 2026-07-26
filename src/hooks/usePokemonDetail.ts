"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDetailPokemon } from "@/services/pokemon";
import { PokemonDetailType } from "@/types/pokemon";

type PokemonDetailView = {
	sprite: string;
	types: string[];
	moves: string[];
	stats: PokemonDetailType["stats"];
	abilities: PokemonDetailType["abilities"];
};

const EMPTY: PokemonDetailView = {
	sprite: "",
	types: [],
	moves: [],
	stats: [],
	abilities: [],
};

export const usePokemonDetail = (name: string) => {
	const [detail, setDetail] = useState<PokemonDetailView>(EMPTY);
	// Sengaja mulai dari false, bukan true: tombol Catch memang sudah tampil pada
	// render pertama sejak versi awal, dan mengubahnya akan mengubah tampilan.
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let subscribed = true;
		setIsLoading(true);

		getDetailPokemon(name)
			.then((pokemon) => {
				if (!subscribed) return;

				setDetail({
					sprite:
						pokemon.sprites.other?.showdown?.front_default ??
						pokemon.sprites.front_default ??
						"",
					types: pokemon.types.map((entry) => entry.type.name),
					moves: pokemon.moves.map((entry) => entry.move.name),
					stats: pokemon.stats,
					abilities: pokemon.abilities,
				});
			})
			.catch(() => {
				if (subscribed) {
					toast.error("Oops!. Fail get pokemons. Please try again!");
				}
			})
			.finally(() => {
				if (subscribed) setIsLoading(false);
			});

		return () => {
			subscribed = false;
		};
	}, [name]);

	return { ...detail, isLoading };
};
