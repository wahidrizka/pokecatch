"use client";
import { useEffect } from "react";
import clsx from "clsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Modal, Text } from "@/components";
import { playCry } from "@/utils";
import styles from "./PokemonDetail.module.css";

type CatchResultModalType = {
	open: boolean;
	caught: boolean;
	name: string;
	sprite: string;
	cry: string;
};

export const CatchResultModal = ({
	open,
	caught,
	name,
	sprite,
	cry,
}: CatchResultModalType) => {
	// Suara sebagai perayaan tangkapan berhasil. Ini menyusul klik tombol
	// Catch, jadi peramban tidak memblokirnya sebagai autoplay.
	useEffect(() => {
		if (open && caught && cry) playCry(cry);
	}, [open, caught, cry]);

	return (
		<Modal open={open} overlay={caught ? "light" : "error"}>
			<div className={clsx(styles["Post--catch-modal"])}>
				<div className={clsx(styles["Image--container"])}>
					<LazyLoadImage
						src={sprite}
						alt={name}
						width={320}
						height={320}
						effect="blur"
						loading="lazy"
					/>
				</div>

				<LazyLoadImage
					src="/static/pokeball.png"
					alt="pokeball"
					width={128}
					height={128}
				/>
				<Text variant="outlined" size="xlarge">
					{caught
						? `Gotcha! ${name.toUpperCase()} was caught!`
						: `Oh no, ${name.toUpperCase()} broke free!`}
				</Text>
			</div>
		</Modal>
	);
};
