"use client";
import React from "react";
import clsx from "clsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
	Button,
	Loading,
	Navbar,
	StatsBar,
	Text,
	TypeCard,
} from "@/components";
import {
	useCatchSequence,
	useDocumentTitle,
	useMyPokemon,
	useNavHeight,
	usePokemonDetail,
} from "@/hooks";
import { getCatchDifficulty, getCatchProbability } from "@/utils";
import styles from "./PokemonDetail.module.css";
import { CatchingModal } from "./CatchingModal";
import { CatchResultModal } from "./CatchResultModal";
import { NicknameModal } from "./NicknameModal";

export const PokemonDetail = ({ name }: { name: string }) => {
	const { sprite, isShiny, types, moves, stats, abilities, captureRate, isLoading } =
		usePokemonDetail(name);
	const { phase, throwPokeball } = useCatchSequence();
	const { keep } = useMyPokemon();
	const { navRef, navHeight } = useNavHeight();

	const catchProbability =
		captureRate !== null ? getCatchProbability(captureRate) : undefined;

	useDocumentTitle(`PokeCatch - ${name.toUpperCase()}`);

	React.useEffect(() => {
		window.scroll({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<>
			<CatchingModal open={phase === "throwing"} name={name} sprite={sprite} />
			<CatchResultModal
				open={phase === "caught" || phase === "escaped"}
				caught={phase === "caught"}
				name={name}
				sprite={sprite}
			/>
			<NicknameModal
				open={phase === "naming"}
				name={name}
				sprite={sprite}
				onSave={(nickname) =>
					keep({ name: name.toUpperCase(), nickname, sprite, isShiny })
				}
			/>

			<div className={clsx(styles["Page"])} style={{ marginBottom: navHeight }}>
				<div className={clsx(styles["Watermark"])}>
					<LazyLoadImage
						src="/static/pokeball-transparent.png"
						width={512}
						height={512}
					/>
				</div>

				<div className={clsx(styles["Pokemon--name"])}>
					<div />
					<div />
					<div />
					<Text as="h1" variant="outlined" size="xlarge">
						{name}
					</Text>
				</div>

				<div className={clsx(styles["Pokemon--container"])}>
					<div className={clsx("pixelated-border", styles["Card-pixelated"])}>
						<Text as="h4" variant="outlined" size="large">
							Pokemon Stats:
						</Text>
						<div className={clsx(styles["Pokemon--stats-wrapper"])}>
							{stats.map((stat) => (
								<div key={stat.stat.name}>
									<Text as="h4" variant="outlined" size="base">
										{stat.stat.name}:
									</Text>
									<StatsBar
										color={stat.stat.name}
										progress={stat.base_stat}
										height={28}
									/>
								</div>
							))}
						</div>
					</div>

					<div className={clsx(styles["Pokemon-sprite"])}>
						{isShiny && (
							<div className={clsx(styles["Shiny--wrapper"])}>
								<div
									className={clsx("pixelated-border", styles["Shiny--chip"])}
								>
									<Text variant="darker">shiny</Text>
								</div>
							</div>
						)}
						{!isLoading ? (
							<LazyLoadImage
								className={clsx(styles["Pokemon--sprite"])}
								src={sprite}
								alt={name}
								width={256}
								height={256}
								effect="blur"
								loading="lazy"
							/>
						) : (
							<div className={clsx(styles["Sprite--loading-wrapper"])}>
								<Loading />
							</div>
						)}
					</div>
				</div>

				<div className={clsx(styles["Pokemon--content"])}>
					<div className={clsx(styles["Abilities--wrapper"])}>
						<div>
							<Text as="h3" variant="outlined">
								Type
							</Text>
							{!isLoading ? (
								types.map((type) => <TypeCard key={type} type={type} />)
							) : (
								<div className={clsx(styles["Description--loading-wrapper"])}>
									<Loading label="Loading Pokemon's types..." />
								</div>
							)}
						</div>

						<div>
							<Text as="h3" variant="outlined">
								Abilities
							</Text>
							{!isLoading ? (
								abilities.map(({ ability }) => (
									<TypeCard key={ability.name} type={ability.name} />
								))
							) : (
								<div className={clsx(styles["Description--loading-wrapper"])}>
									<Loading label="Loading Pokemon's abilities..." />
								</div>
							)}
						</div>
					</div>

					<div>
						<Text as="h3">Moves</Text>
						{!isLoading ? (
							<div className={clsx(styles["Grid"])}>
								{moves.map((move) => (
									<div
										key={move}
										className={clsx("pixelated-border", styles["Move--chip"])}
									>
										<Text>{move}</Text>
									</div>
								))}
							</div>
						) : (
							<div className={clsx(styles["Description--loading-wrapper"])}>
								<Loading label="Loading Pokemon's abilities..." />
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 288, bukan 224: cluster kini memuat chip kesulitan di atas tombol,
			    dan gradien harus tetap menutupi seluruhnya agar tidak menimpa konten. */}
			<Navbar ref={navRef} fadeHeight={288}>
				{!isLoading && (
					<div className={clsx(styles["Catch--cluster"])}>
						{captureRate !== null && (
							<div
								className={clsx(
									"pixelated-border",
									styles["Difficulty--chip"]
								)}
							>
								<Text>{getCatchDifficulty(captureRate)}</Text>
							</div>
						)}
						<Button
							as="button"
							variant="dark"
							onClick={() => throwPokeball(catchProbability)}
							size="xlarge"
							icon="/static/pokeball.png"
						>
							Catch
						</Button>
					</div>
				)}
			</Navbar>
		</>
	);
};
