/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button, Loading, Modal, Navbar, StatsBar, Text } from "@/components";
import React from "react";
import clsx from "clsx";
import styles from "./PokemonDetail.module.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useGlobalContext } from "@/context";
import { PokemonDetailType } from "@/types/pokemon";
import { getDetailPokemon } from "@/services/pokemon";
import { generatePokemonSummary } from "@/helpers";
import toast from "react-hot-toast";
import { TypeCard } from "@/components/ui/TypeCard/TypeCard";

type PokemonTypes = { type: { name: string } };
type PokemonMoves = { move: { name: string } };

export const PokemonDetail = ({ name }: { name: string }) => {
	const catchPokemonTimeout = React.useRef<NodeJS.Timeout | number>(0);
	const throwBallTimeout = React.useRef<NodeJS.Timeout | number>(0);

	const [sprite, setSprite] = React.useState<string>("");
	const [types, setTypes] = React.useState<string[]>([]);
	const [moves, setMoves] = React.useState<string[]>([]);
	const [nickname, setNickname] = React.useState<string>("");
	const [navHeight, setNavHeight] = React.useState<number>(0);
	const [stats, setStats] = React.useState<PokemonDetailType["stats"]>([]);
	const [abilities, setAbilities] = React.useState<
		PokemonDetailType["abilities"]
	>([]);

	const [saved, setSaved] = React.useState<boolean>(false);
	const [caught, setCaught] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [catching, setCatching] = React.useState<boolean>(false);
	const [endPhase, setEndPhase] = React.useState<boolean>(false);

	const [nicknameModal, setNicknameModal] = React.useState<boolean>(false);
	const [nicknameValid, setNicknameValid] = React.useState<boolean>(true);

	const { setState } = useGlobalContext();
	const navRef = React.createRef<HTMLDivElement>();

	async function loadPokemon() {
		try {
			setLoading(true);

			const response = await getDetailPokemon(name);

			setTypes(response.types.map((type: PokemonTypes) => type.type.name));
			setMoves(response?.moves.map((move: PokemonMoves) => move.move?.name));
			setSprite(
				response?.sprites.versions?.["generation-v"]?.["black-white"].animated
					.front_default || response?.sprites.front_default
			);

			setStats(response?.stats);
			setAbilities(response?.abilities);
			setLoading(false);
		} catch (error) {
			toast.error("Oops!. Fail get pokemons. Please try again!");
			setLoading(false);
			console.error({ error });
		}
	}

	async function catchPokemon() {
		if (catchPokemonTimeout.current)
			clearTimeout(catchPokemonTimeout.current as number);

		return new Promise((resolve) => {
			catchPokemonTimeout.current = setTimeout(() => {
				resolve(Math.random() < 0.5 ? false : true);
			}, 2000);
		});
	}

	async function throwPokeball() {
		setCatching(true);
		const caught = await catchPokemon();
		setCatching(false);
		setEndPhase(true);

		if (caught) {
			setCaught(true);
		} else {
			setCaught(false);
		}

		if (throwBallTimeout.current)
			clearTimeout(throwBallTimeout.current as number);

		throwBallTimeout.current = setTimeout(() => {
			setEndPhase(false);
			if (caught) {
				setNicknameModal(true);
			}
		}, 1200);
	}

	async function onNicknameSave(e: React.FormEvent) {
		e.preventDefault();

		const currentCollection = localStorage.getItem("pokecatch@myPokemon");
		const parsed: { name: string; nickname: string; sprite: string }[] =
			JSON.parse(currentCollection!) || [];

		let isUnique = true;
		for (const collection of parsed) {
			if (collection.nickname === nickname) {
				setNicknameValid(false);
				isUnique = false;
				return;
			} else {
				if (!nicknameValid) {
					setNicknameValid(true);
				}
				isUnique = true;
			}

			if (isUnique) {
				parsed.push({ name: name!.toUpperCase(), nickname, sprite });
				localStorage.setItem("pokecatch@myPokemon", JSON.stringify(parsed));
				setState({ pokemonSummary: generatePokemonSummary(parsed) });
				setSaved(true);
			}
		}
	}

	React.useEffect(() => {
		setNavHeight(navRef.current?.clientHeight as number);
		loadPokemon();

		return () => {
			setTypes([]);
			setMoves([]);
			setStats([]);
			setSprite("");
			setAbilities([]);
		};
	}, []);

	React.useEffect(() => {
		document.title = `PokeCatch - ${name?.toUpperCase()}`;

		return () => {
			document.title = "PokeCatch";
		};
	});

	React.useEffect(() => {
		window.scroll({
			top: 0,
			behavior: "smooth",
		});
	}, []);

	return (
		<>
			<Modal open={catching}>
				<div>
					<div className={clsx(styles["Image--container"])}>
						<LazyLoadImage
							src={sprite}
							alt="name"
							width={320}
							height={320}
							effect="blur"
							loading="lazy"
						/>
					</div>
				</div>
			</Modal>

			<div className={clsx(styles["Page"])} style={{ marginBottom: navHeight }}>
				<LazyLoadImage
					src="/static/pokeball-transparent.png"
					width={512}
					height={512}
				/>

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
							{stats.map((stat, statIndex) => {
								const pokemonBaseStat = stat?.base_stat ?? 0;
								const pokemonStatName = stat?.stat;

								return (
									<div key={statIndex}>
										<Text as="h4" variant="outlined" size="base">
											{pokemonStatName?.name}:
										</Text>
										<StatsBar
											color={pokemonStatName?.name}
											progress={pokemonBaseStat}
											height={28}
										/>
									</div>
								);
							})}
						</div>
					</div>

					<div className={clsx(styles["Pokemon-sprite"])}>
						{!loading ? (
							<LazyLoadImage
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
						<div className="pxl-type">
							<Text as="h3" variant="outlined">
								Type
							</Text>
							{!loading ? (
								types.map((type: string, typeIndex: number) => (
									<TypeCard key={typeIndex} type={type} />
								))
							) : (
								<div className={clsx(styles["Description--loading-wrapper"])}>
									<Loading label="Loading Pokemon's types..." />
								</div>
							)}
						</div>

						<div className="pxl-abilities">
							<Text as="h3" variant="outlined">
								Abilities
							</Text>
							{!loading ? (
								abilities &&
								abilities.map((ability, abilityIndex) => (
									<TypeCard key={abilityIndex} type={ability.ability?.name} />
								))
							) : (
								<div className={clsx(styles["Description--loading-wrapper"])}>
									<Loading label="Loading Pokemon's abilities..." />
								</div>
							)}
						</div>
					</div>

					<div className="pxl-moves">
						<Text as="h3">Moves</Text>
						{!loading ? (
							<div className={clsx(styles["Grid"])}>
								{moves &&
									moves.map((move: string, moveIndex: number) => (
										<div
											key={moveIndex}
											className={clsx("pixelated-border")}
											style={{ marginBottom: 16, marginRight: 16 }}
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

			<Navbar ref={navRef} fadeHeight={224}>
				{!loading && (
					<Button
						as="button"
						variant="dark"
						onClick={() => throwPokeball()}
						size="xlarge"
						icon="/static/pokeball.png"
					>
						Catch
					</Button>
				)}
			</Navbar>
		</>
	);
};
