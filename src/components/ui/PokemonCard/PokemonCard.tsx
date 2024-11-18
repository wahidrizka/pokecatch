/* eslint-disable @next/next/no-img-element */
"use client";
import clsx from "clsx";
import React, { HTMLAttributes } from "react";
import styles from "./PokemonCard.module.css";
import { Text } from "../Text";
import { POKEMON_IMAGE } from "@/configs/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

type PokemonCardType = {
	name?: string;
	nickname?: string;
	captured?: number;
	sprite?: string;
	pokemonId?: number | string;
} & HTMLAttributes<HTMLDivElement>;

export const PokemonCard: React.FC<PokemonCardType> = ({
	name,
	nickname,
	captured,
	sprite,
	pokemonId,
	children,
}) => {
	return (
		<div
			className={clsx(
				"pixelated-border",
				styles["Card"],
				nickname
					? styles["Card--cursor-default"]
					: styles["Card--cursor-darker"],
				nickname
					? styles["Card-hover-background-default"]
					: styles["Card-hover-background-darker"],
				nickname
					? styles["Card-active-shadow-default"]
					: styles["Card-active-shadow-darker"]
			)}
		>
			{nickname ? (
				<div>
					<LazyLoadImage
						src={sprite}
						alt={`pokemon ${name}`}
						width={96}
						height={96}
						loading="lazy"
					/>
					<Text variant="darker" size="large">
						{nickname}
					</Text>
				</div>
			) : (
				<LazyLoadImage
					src={`${POKEMON_IMAGE}/${pokemonId}.png`}
					alt={`pokemon ${name}`}
					width={96}
					height={96}
					loading="lazy"
					effect="blur"
				/>
			)}
			<Text variant="outlined">{name}</Text>
			{children}
			{captured ? (
				<div className={clsx(styles["Captured-quantity"])}>
					<img
						src="/static/pokeball.png"
						alt="pokeball"
						width={16}
						height={16}
					/>
					<Text>x{captured}</Text>
				</div>
			) : null}
		</div>
	);
};
