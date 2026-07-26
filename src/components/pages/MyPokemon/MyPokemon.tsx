"use client";
import React from "react";
import clsx from "clsx";
import Link from "next/link";
import {
	Button,
	DeleteButton,
	Modal,
	Navbar,
	PokemonCard,
	Text,
} from "@/components";
import { useMyPokemon, useNavHeight } from "@/hooks";
import styles from "./MyPokemon.module.css";

export const MyPokemon: React.FC = () => {
	const { pokemons, release } = useMyPokemon();
	const { navRef, navHeight } = useNavHeight();
	const [pendingRelease, setPendingRelease] = React.useState<string | null>(
		null
	);

	return (
		<>
			<Modal open={pendingRelease !== null} overlay="light">
				<div className={clsx(styles["Delete--confirmation-modal"])}>
					<div className={clsx("pixelated-border", styles["Prompt"])}>
						<Text>Are you sure you want to release {pendingRelease}?</Text>
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
								if (pendingRelease) release(pendingRelease);
								setPendingRelease(null);
							}}
						>
							Release
						</Button>
						<Button as="button" onClick={() => setPendingRelease(null)}>
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

				{pokemons.length ? (
					<div className={clsx(styles["Grid"])}>
						{[...pokemons].reverse().map((pokemon) => (
							<div
								key={pokemon.nickname}
								className={clsx(styles["Wrapper-card-list"])}
							>
								<PokemonCard
									name={pokemon.name}
									nickname={pokemon.nickname}
									sprite={pokemon.sprite}
									isShiny={pokemon.isShiny}
								>
									<DeleteButton
										aria-label={`Release ${pokemon.nickname}`}
										onClick={() => setPendingRelease(pokemon.nickname)}
									/>
								</PokemonCard>
							</div>
						))}
					</div>
				) : (
					<div className={clsx(styles["Empty--state"])}>
						<Text variant="outlined">
							You haven&apos;t caught any pokemon yet!
						</Text>
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
