import clsx from "clsx";
import React from "react";
import styles from "./StartScreen.module.css";
import { Button, Text } from "@/components";
import Link from "next/link";

export const StartScreen: React.FC = () => {
	return (
		<section className={clsx(styles["Container"])}>
			<div className={clsx(styles["Centered"])}>
				<Text
					as="h1"
					variant="outlined"
					size="xlarge"
					style={{ fontWeight: "bold" }}
				>
					PokeCatch
				</Text>
				<Button href="/pokemons">Press Start</Button>
				<Text variant="outlined" size="base">
					Source API{" "}
					<Link
						className={clsx(styles["A"])}
						href="https://pokeapi.co"
						target="_blank"
					>
						here
					</Link>
				</Text>
			</div>

			<div className={clsx(styles["Footer"])}>
				<Text variant="outlined">
					&copy;{new Date().getFullYear()} wahidrizka
				</Text>
				<Text variant="outlined">
					| Want to contribute?{" "}
					<a
						className={clsx(styles["A"])}
						href="https://github.com/radespratama/pokegames"
						target="_blank"
					>
						Github
					</a>
				</Text>
			</div>
		</section>
	);
};
