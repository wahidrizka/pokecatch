"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDetailPokemon, getPokemonSpecies } from "@/services/pokemon";
import { PokemonDetailType } from "@/types/pokemon";
import { normalizeFlavorText } from "@/utils";

// Setiap kunjungan halaman me-roll shiny sekali — dasar loop "berburu shiny".
const SHINY_ODDS = 1 / 64;

type PokemonDetailView = {
	sprite: string;
	isShiny: boolean;
	cry: string;
	types: string[];
	moves: string[];
	stats: PokemonDetailType["stats"];
	abilities: PokemonDetailType["abilities"];
};

/** Bagian yang datang dari /pokemon-species, terisi setelah detail termuat. */
type PokemonSpeciesView = {
	captureRate: number | null;
	flavorText: string;
	genus: string;
	evolutionChainUrl: string | null;
};

const EMPTY: PokemonDetailView = {
	sprite: "",
	isShiny: false,
	cry: "",
	types: [],
	moves: [],
	stats: [],
	abilities: [],
};

const EMPTY_SPECIES: PokemonSpeciesView = {
	captureRate: null,
	flavorText: "",
	genus: "",
	evolutionChainUrl: null,
};

export const usePokemonDetail = (name: string) => {
	const [detail, setDetail] = useState<PokemonDetailView>(EMPTY);
	const [species, setSpecies] = useState<PokemonSpeciesView>(EMPTY_SPECIES);
	// Sengaja mulai dari false, bukan true: tombol Catch memang sudah tampil pada
	// render pertama sejak versi awal, dan mengubahnya akan mengubah tampilan.
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let subscribed = true;
		setIsLoading(true);
		setSpecies(EMPTY_SPECIES);

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
					cry: pokemon.cries?.latest ?? "",
					types: pokemon.types.map((entry) => entry.type.name),
					moves: pokemon.moves.map((entry) => entry.move.name),
					stats: pokemon.stats,
					abilities: pokemon.abilities,
				});

				try {
					const data = await getPokemonSpecies(pokemon.species.name);
					if (!subscribed) return;

					// Entri terakhir = teks dari game paling baru.
					const english = data.flavor_text_entries.filter(
						(entry) => entry.language.name === "en"
					);
					const genus = data.genera.find(
						(entry) => entry.language.name === "en"
					);

					setSpecies({
						captureRate: data.capture_rate,
						flavorText: english.length
							? normalizeFlavorText(english[english.length - 1].flavor_text)
							: "",
						genus: genus?.genus ?? "",
						evolutionChainUrl: data.evolution_chain?.url ?? null,
					});
				} catch {
					// Tanpa species permainan tetap jalan: peluang jatuh ke default,
					// serta chip kesulitan, teks Pokedex, dan evolusi tidak dirender.
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

	return { ...detail, ...species, isLoading };
};
