import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Text } from "@/components";
import { POKEMON_IMAGE } from "@/configs/api";
import { EvolutionStage } from "@/hooks";
import styles from "./PokemonDetail.module.css";

type EvolutionChainType = {
	stages: EvolutionStage[];
	currentName: string;
};

export const EvolutionChain = ({
	stages,
	currentName,
}: EvolutionChainType) => (
	<div>
		<Text as="h3" variant="outlined">
			Evolution
		</Text>
		<div className={clsx(styles["Evolution--row"])}>
			{stages.map((stage, index) => (
				<React.Fragment key={stage.name}>
					{/* Panah hanya di antara tahap yang berbeda kedalaman; cabang
					    sejajar (Eevee) berdampingan tanpa panah berulang. */}
					{index > 0 && stage.depth > stages[index - 1].depth && (
						<Text variant="outlined" size="large">
							→
						</Text>
					)}
					<Link
						href={`/pokemon/${stage.name}`}
						aria-current={stage.name === currentName ? "page" : undefined}
						className={clsx(
							"pixelated-border",
							styles["Evolution--stage"],
							stage.name === currentName && styles["Evolution--stage-current"]
						)}
					>
						<LazyLoadImage
							src={`${POKEMON_IMAGE}/${stage.id}.png`}
							alt={stage.name}
							width={72}
							height={72}
							loading="lazy"
						/>
						<Text>{stage.name}</Text>
					</Link>
				</React.Fragment>
			))}
		</div>
	</div>
);
