"use client";
import React, { ChangeEvent } from "react";
import clsx from "clsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Button, Input, Modal, Text } from "@/components";
import styles from "./PokemonDetail.module.css";

type NicknameModalType = {
	open: boolean;
	name: string;
	sprite: string;
	/** Mengembalikan false kalau nickname sudah dipakai. */
	onSave: (nickname: string) => boolean;
};

export const NicknameModal = ({
	open,
	name,
	sprite,
	onSave,
}: NicknameModalType) => {
	const [nickname, setNickname] = React.useState("");
	const [isTaken, setIsTaken] = React.useState(false);
	const [isSaved, setIsSaved] = React.useState(false);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const accepted = onSave(nickname);

		setIsTaken(!accepted);
		setIsSaved(accepted);
	};

	return (
		<Modal open={open} overlay="light" solid>
			<div className={clsx(styles["Nicknaming--modal"])}>
				<div className={clsx(styles["Image--container"])}>
					<LazyLoadImage
						className={clsx(styles["Pokemon--sprite"])}
						src={sprite}
						alt={name}
						width={320}
						height={320}
						effect="blur"
						loading="lazy"
					/>
				</div>

				{!isSaved ? (
					<form
						className={clsx(styles["Nicknaming--form"])}
						onSubmit={handleSubmit}
					>
						<div
							className={clsx("pixelated-border", styles["Nicknaming--prompt"])}
						>
							{isTaken ? (
								<>
									<Text variant="error">Nickname is taken</Text>
									<Text>Please pick another nickname...</Text>
								</>
							) : (
								<>
									<Text>Congratulations!</Text>
									<Text>You just caught a {name.toUpperCase()}</Text>
									<br />
									<Text>Now please give {name.toUpperCase()} a nickname...</Text>
								</>
							)}
						</div>

						<Input
							required
							placeholder="enter a nickname"
							onChange={(event: ChangeEvent<HTMLInputElement>) =>
								setNickname(event.target.value.toUpperCase())
							}
						/>
						<Button as="button" type="submit">
							Save
						</Button>
					</form>
				) : (
					<div className={clsx(styles["Another--wrapper"])}>
						<div
							className={clsx("pixelated-border", styles["Nicknaming--prompt"])}
						>
							<Text>Whoosh! {nickname} is now in your Pokemon list</Text>
						</div>

						<Button href="/my-pokemon" variant="light">
							See My Pokemon
						</Button>
						<Button href="/pokemons">Catch Another Pokemon</Button>
					</div>
				)}
			</div>
		</Modal>
	);
};
