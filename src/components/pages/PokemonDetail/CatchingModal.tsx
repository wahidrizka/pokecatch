import clsx from "clsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Modal, Text } from "@/components";
import styles from "./PokemonDetail.module.css";

type CatchingModalType = {
	open: boolean;
	name: string;
	sprite: string;
};

export const CatchingModal = ({ open, name, sprite }: CatchingModalType) => (
	<Modal open={open}>
		<div>
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

			<div className={clsx(styles["Throwing--wrapper"])}>
				<LazyLoadImage
					className={clsx(styles["Pokeball"])}
					src="/static/pokeball.png"
					alt="Pokeball"
					width={128}
					height={128}
				/>
				<Text variant="outlined" size="xlarge">
					Catching...
				</Text>
			</div>
		</div>
	</Modal>
);
