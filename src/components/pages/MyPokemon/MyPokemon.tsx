/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
	Button,
	DeleteButton,
	Modal,
	Navbar,
	PokemonCard,
	Text,
} from "@/components";
import { useGlobalContext } from "@/context";
import {
	generatePokemonSummary,
	loadMyPokemonFromLocalStorage,
} from "@/helpers";
import { MyPokemonType } from "@/types/pokemon";
import clsx from "clsx";
import React from "react";
import styles from "./MyPokemon.module.css";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const MyPokemon: React.FC = () => {
	const [pokemons, setPokemons] = React.useState<MyPokemonType[]>([]);
	const [deleteConfirmation, setDeleteConfirmation] =
		React.useState<boolean>(false);
	const [selectedPokemon, setSelectedPokemon] = React.useState<string>("");
	const [navHeight, setNavHeight] = React.useState<number>(0);
	const { setState } = useGlobalContext();
	const navRef = React.createRef<HTMLDivElement>();

	function loadMyPokemon() {
		const parsed = loadMyPokemonFromLocalStorage();
		setPokemons(parsed);
	}

	React.useEffect(() => {
		setNavHeight(navRef.current?.clientHeight as number);
		loadMyPokemon();
	}, []);

	function releasePokemon(nickname: string) {
		const newCollection = pokemons.filter(
			(pokemon: MyPokemonType) => pokemon.nickname !== nickname
		);
		localStorage.setItem("pokecatch@myPokemon", JSON.stringify(newCollection));

		loadMyPokemon();
		setState({ pokemonSummary: generatePokemonSummary(newCollection) });
	}

	return (
		<>
			<Modal open={deleteConfirmation} overlay="light">
				<div className={clsx(styles["Delete--confirmation-modal"])}>
					<div
						className={clsx("pixelated-border")}
						style={{ textAlign: "left" }}
					>
						<Text>Are you sure you want to release {selectedPokemon}?</Text>
						<br />
						<Text>
							You&apos;ll have to catch another one and cannot undo this action
						</Text>
					</div>

					<div>
						<Button
							as="button"
							variant="light"
							onClick={() => {
								releasePokemon(selectedPokemon);
								setDeleteConfirmation(false);
							}}
						>
							Release
						</Button>
						<Button as="button" onClick={() => setDeleteConfirmation(false)}>
							Cancel
						</Button>
					</div>
				</div>
			</Modal>

			<div className={clsx(styles["Page"])} style={{ marginBottom: navHeight }}>
				<header className={clsx(styles["Header"])}>
					<Text as="h1" variant="outlined" size="large">
						My Pokemon
					</Text>
					<Text as="p" variant="outlined" size="base">
						Total: {pokemons.length}
					</Text>
				</header>

				{pokemons?.length ? (
					<div className={clsx(styles["Grid"])}>
						{pokemons?.length &&
							[...pokemons].reverse().map((pokemon: MyPokemonType) => (
								<div
									key={pokemon.nickname}
									className={clsx(styles["Wrapper-card-list"])}
								>
									<PokemonCard
										name={pokemon.name}
										nickname={pokemon.nickname}
										sprite={pokemon.sprite}
									>
										<DeleteButton
											onClick={() => {
												setSelectedPokemon(pokemon.nickname);
												setDeleteConfirmation(true);
											}}
										/>
									</PokemonCard>
								</div>
							))}
					</div>
				) : (
					<div className={clsx(styles["Empty--state"])}>
						<Text> You haven&apos;t caught any pokemon yet!</Text>
						<Link href="/pokemons">
							<Button as="button" variant="light">
								Explore pokemons
							</Button>
						</Link>
					</div>
				)}
			</div>

			<Navbar ref={navRef} />
		</>
	);
};
