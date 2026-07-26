"use client";
import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { Button, Loading, Navbar, PokemonCard, Text } from "@/components";
import { useNavHeight, usePokemonList } from "@/hooks";
import { getPokemonId } from "@/utils";
import styles from "./Explore.module.css";

export const Explore: React.FC = () => {
	const { pokemons, isLoading, hasMore, loadMore } = usePokemonList();
	const { navRef, navHeight } = useNavHeight();

	return (
		<>
			<div
				className={clsx(styles["Container"])}
				style={{ marginBottom: navHeight }}
			>
				<Text
					variant="outlined"
					size="large"
					className={clsx(styles["Headline"])}
				>
					Browse the list of Pokémon and discover their unique abilities and
					stats.
				</Text>

				<div className={clsx(styles["Grid"])}>
					{pokemons.map((pokemon) => (
						<Link
							key={pokemon.name}
							href={`/pokemon/${pokemon.name}`}
							className={clsx(styles["Card--link"])}
						>
							<PokemonCard
								pokemonId={getPokemonId(pokemon.url ?? "")}
								name={pokemon.name}
								captured={pokemon.captured}
							/>
						</Link>
					))}
				</div>

				{isLoading ? (
					<Loading label="Loading pokemon..." />
				) : (
					hasMore && (
						<footer className={clsx(styles["Footer"])}>
							<Button as="button" onClick={loadMore}>
								Load More Pokémon
							</Button>
						</footer>
					)
				)}
			</div>

			<Navbar ref={navRef} />
		</>
	);
};
