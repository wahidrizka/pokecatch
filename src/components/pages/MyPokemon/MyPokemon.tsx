"use client";
import React, { ChangeEvent } from "react";
import clsx from "clsx";
import Link from "next/link";
import toast from "react-hot-toast";
import {
	Button,
	DeleteButton,
	Modal,
	Navbar,
	PokemonCard,
	Text,
} from "@/components";
import { useMyPokemon, useNavHeight, usePokedexProgress } from "@/hooks";
import { parseMyPokemonFile, serializeMyPokemon } from "@/helpers";
import styles from "./MyPokemon.module.css";

export const MyPokemon: React.FC = () => {
	const { pokemons, release, importMany } = useMyPokemon();
	const { caught, total } = usePokedexProgress(pokemons);
	const { navRef, navHeight } = useNavHeight();
	const [pendingRelease, setPendingRelease] = React.useState<string | null>(
		null
	);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const exportCollection = () => {
		const blob = new Blob([serializeMyPokemon(pokemons)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `pokecatch-${new Date().toISOString().slice(0, 10)}.json`;
		anchor.click();
		URL.revokeObjectURL(url);
	};

	const onImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		// Kosongkan supaya file yang sama bisa dipilih lagi di percobaan berikutnya.
		event.target.value = "";
		if (!file) return;

		try {
			const entries = parseMyPokemonFile(await file.text());
			const { added, skipped } = importMany(entries);
			toast.success(
				`${added} imported${skipped ? `, ${skipped} skipped (nickname taken)` : ""}`
			);
		} catch {
			toast.error("Invalid collection file");
		}
	};

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
					<div className={clsx(styles["Header--actions"])}>
						{pokemons.length > 0 && (
							<Button as="button" variant="light" onClick={exportCollection}>
								Export
							</Button>
						)}
						<Button as="button" onClick={() => fileInputRef.current?.click()}>
							Import
						</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept="application/json,.json"
							hidden
							onChange={onImportFile}
						/>
					</div>
				</header>

				<div className={clsx(styles["Stats--row"])}>
					<Text as="p" variant="outlined" size="base">
						Total: {pokemons.length}
					</Text>
					{total !== null && (
						<>
							<Text as="p" variant="outlined" size="base">
								Pokédex: {caught}/{total}
							</Text>
							<div
								className={clsx("pixelated-border", styles["Progress--track"])}
							>
								<div
									className={clsx(styles["Progress--fill"])}
									style={{
										width: `${Math.min((caught / total) * 100, 100)}%`,
									}}
								/>
							</div>
						</>
					)}
				</div>

				{pokemons.length ? (
					<div className={clsx(styles["Grid"])}>
						{[...pokemons].reverse().map((pokemon) => (
							<div
								key={pokemon.nickname}
								className={clsx(styles["Wrapper-card-list"])}
							>
								<Link
									href={`/pokemon/${pokemon.name.toLowerCase()}`}
									className={clsx(styles["Card--link"])}
								>
									<PokemonCard
										name={pokemon.name}
										nickname={pokemon.nickname}
										sprite={pokemon.sprite}
										isShiny={pokemon.isShiny}
									>
										<DeleteButton
											aria-label={`Release ${pokemon.nickname}`}
											onClick={(event) => {
												// Tombol lepas hidup di dalam Link: tahan navigasinya.
												event.preventDefault();
												event.stopPropagation();
												setPendingRelease(pokemon.nickname);
											}}
										/>
									</PokemonCard>
								</Link>
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
