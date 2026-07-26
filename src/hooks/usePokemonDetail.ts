"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDetailPokemon, getPokemonSpecies } from "@/services/pokemon";
import { PokemonDetailType } from "@/types/pokemon";

// Setiap kunjungan halaman me-roll shiny sekali — dasar loop "berburu shiny".
const SHINY_ODDS = 1 / 64;

type PokemonDetailView = {
	sprite: string;
	isShiny: boolean;
	types: string[];
	moves: string[];
	stats: PokemonDetailType["stats"];
	abilities: PokemonDetailType["abilities"];
};

const EMPTY: PokemonDetailView = {
	sprite: "",
	isShiny: false,
	types: [],
	moves: [],
	stats: [],
	abilities: [],
};

export const usePokemonDetail = (name: string) => {
	const [detail, setDetail] = useState<PokemonDetailView>(EMPTY);
	const [captureRate, setCaptureRate] = useState<number | null>(null);
	// Sengaja mulai dari false, bukan true: tombol Catch memang sudah tampil pada
	// render pertama sejak versi awal, dan mengubahnya akan mengubah tampilan.
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let subscribed = true;
		setIsLoading(true);
		setCaptureRate(null);

		getDetailPokemon(name)
			.then(async (pokemon) => {
				if (!subscribed) return;

				const shinySprite =
					pokemon.sprites.other?.showdown?.front_shiny ??
					pokemon.sprites.front_shiny;
				const defaultSprite =
					pokemon.sprites.other?.showdown?.front_default ??
					pokemon.sprites.front_default ??
					"";
				// Shiny hanya diakui bila sprite shiny-nya benar-benar ada.
				const isShiny = Math.random() < SHINY_ODDS && Boolean(shinySprite);

				setDetail({
					sprite: isShiny && shinySprite ? shinySprite : defaultSprite,
					isShiny,
					types: pokemon.types.map((entry) => entry.type.name),
					moves: pokemon.moves.map((entry) => entry.move.name),
					stats: pokemon.stats,
					abilities: pokemon.abilities,
				});

				try {
					const species = await getPokemonSpecies(pokemon.species.name);
					if (subscribed) setCaptureRate(species.capture_rate);
				} catch {
					// Tanpa capture_rate permainan tetap jalan: peluang jatuh ke
					// default dan chip kesulitan tidak ditampilkan.
				}
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

	return { ...detail, captureRate, isLoading };
};
