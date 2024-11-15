/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { createRef } from "react";
import clsx from "clsx";
import styles from "./Explore.module.css";
import { Button, Loading, Navbar, PokemonCard, Text } from "@/components";
import { POKEMON_API } from "@/configs/api";
import { getAllPokemon } from "@/services/pokemon";
import { useGlobalContext } from "@/context";
import { PokemonType } from "@/types/pokemon";
import Link from "next/link";
import { getPokemonId } from "@/utils";

export const Explore: React.FC = () => {
	const { state, setState } = useGlobalContext();
	const navRef = createRef<HTMLDivElement>();

	const [pokemonURL, setPokemonURL] = React.useState<string>(
		`${POKEMON_API}?limit=50&offset=0`
	);
	const [isFetchingPokemon, setIsFetchingPokemon] =
		React.useState<boolean>(false);
	const [navHeight, setNavHeight] = React.useState<number>(0);

	const loadPokemons = async () => {
		if (pokemonURL) {
			try {
				setIsFetchingPokemon(true);

				const response = await getAllPokemon(50, state.pokemons?.length || 0);

				const filteredSummary =
					response?.results?.map((result) => {
						const summaryIdx =
							state?.pokemonSummary?.findIndex(
								(el) => el.name === result.name.toUpperCase()
							) || 0;
						return {
							name: result.name,
							url: result.url,
							captured: state?.pokemonSummary?.[summaryIdx]?.captured ?? 0,
						};
					}) || [];

				setState({ pokemons: [...(state.pokemons || []), ...filteredSummary] });
				setPokemonURL(response?.next || "");
				setIsFetchingPokemon(false);
			} catch (error) {
				setIsFetchingPokemon(false);
			}
		}
	};

	React.useEffect(() => {
		setNavHeight(navRef.current?.clientHeight as number);
		if (!state.pokemons?.length) {
			loadPokemons();
		}
	}, []);

	return (
		<>
			<div
				className={clsx(styles["Container"])}
				style={{ marginBottom: navHeight }}
			>
				<Text
					variant="outlined"
					size="large"
					style={{ fontWeight: "bold", textTransform: "uppercase" }}
				>
					Browse the list of Pokémon and discover their unique abilities and
					stats.
				</Text>

				<div className={clsx(styles["Grid"])}>
					{state?.pokemons?.length
						? state?.pokemons.map((pokemon: PokemonType) => (
								<Link
									key={`${pokemon.name}-${Math.random()}`}
									href={`/pokemon/${pokemon?.name}`}
									style={{ display: "flex" }}
								>
									<PokemonCard
										pokemonId={getPokemonId(pokemon?.url ?? "")}
										name={pokemon?.name}
										captured={pokemon?.captured}
									/>
								</Link>
						  ))
						: null}
				</div>
				{!isFetchingPokemon ? (
					pokemonURL && (
						<footer className={clsx(styles["Footer"])}>
							<Button as="button" onClick={() => loadPokemons()}>
								Load More Pokémon
							</Button>
						</footer>
					)
				) : (
					<Loading label="Loading pokemon..." />
				)}
			</div>

			<Navbar ref={navRef} />
		</>
	);
};
