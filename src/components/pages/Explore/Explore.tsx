"use client";
import React, { ChangeEvent } from "react";
import clsx from "clsx";
import Link from "next/link";
import {
	Button,
	Input,
	Loading,
	Navbar,
	PokemonCard,
	Text,
} from "@/components";
import { useNavHeight, usePokemonList, usePokemonSearch } from "@/hooks";
import { getPokemonId } from "@/utils";
import styles from "./Explore.module.css";
import { TypeFilterBar } from "./TypeFilterBar";

export const Explore: React.FC = () => {
	const { pokemons, isLoading, hasMore, loadMore } = usePokemonList();
	const {
		query,
		search,
		activeType,
		toggleType,
		results,
		isFiltering,
		isSearchLoading,
	} = usePokemonSearch();
	const { navRef, navHeight } = useNavHeight();

	const shownPokemons = isFiltering ? results : pokemons;

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

				<div className={clsx(styles["Search--wrapper"])}>
					<Input
						value={query}
						placeholder="search pokémon"
						aria-label="search pokémon"
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							search(event.target.value)
						}
					/>
				</div>

				<TypeFilterBar activeType={activeType} onToggle={toggleType} />

				{isFiltering && !isSearchLoading && (
					<Text variant="outlined">
						{results.length
							? `${results.length} Pokémon found`
							: "No Pokémon found"}
					</Text>
				)}

				<div className={clsx(styles["Grid"])}>
					{shownPokemons.map((pokemon) => (
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

				{isFiltering ? (
					isSearchLoading && <Loading label="Loading pokemon..." />
				) : isLoading ? (
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
