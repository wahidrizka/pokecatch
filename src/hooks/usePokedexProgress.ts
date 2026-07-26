"use client";
import { useEffect, useMemo, useState } from "react";
import { getAllPokemon } from "@/services/pokemon";
import { MyPokemonType } from "@/types/pokemon";

/**
 * Progres Pokédex: spesies unik yang dimiliki terhadap total di PokeAPI.
 * Total diambil dari `count` (request limit=1, supermurah) alih-alih angka
 * hardcode, supaya ikut bertambah saat PokeAPI menambah generasi. Gagal
 * fetch → total null dan pemanggil menyembunyikan baris progresnya.
 */
export const usePokedexProgress = (pokemons: MyPokemonType[]) => {
	const [total, setTotal] = useState<number | null>(null);

	useEffect(() => {
		let subscribed = true;

		getAllPokemon(1, 0)
			.then((page) => {
				if (subscribed) setTotal(page.count);
			})
			.catch(() => {
				// Degradasi: tanpa total, baris progres tidak dirender.
			});

		return () => {
			subscribed = false;
		};
	}, []);

	const caught = useMemo(
		() => new Set(pokemons.map((pokemon) => pokemon.name)).size,
		[pokemons]
	);

	return { caught, total };
};
