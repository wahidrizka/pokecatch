import clsx from "clsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Modal, Text } from "@/components";
import styles from "./PokemonDetail.module.css";

type CatchResultModalType = {
	open: boolean;
	caught: boolean;
	name: string;
	sprite: string;
};

export const CatchResultModal = ({
	open,
	caught,
	name,
	sprite,
}: CatchResultModalType) => (
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
