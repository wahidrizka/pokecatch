import React from "react";
import clsx from "clsx";
import { TypeCard } from "@/components";
import styles from "./Explore.module.css";

// 18 tipe kanonik PokeAPI — persis nama class warna di TypeCard.module.css.
const POKEMON_TYPES = [
	"normal",
	"fire",
	"water",
	"grass",
	"electric",
	"ice",
	"fighting",
	"poison",
	"ground",
	"flying",
	"psychic",
	"bug",
	"rock",
	"ghost",
	"dragon",
	"dark",
	"steel",
	"fairy",
];

type TypeFilterBarType = {
	activeType: string | null;
	onToggle: (type: string) => void;
};

export const TypeFilterBar = ({ activeType, onToggle }: TypeFilterBarType) => (
	<div className={clsx(styles["Type-filter"])}>
		{POKEMON_TYPES.map((type) => (
			<button
				key={type}
				type="button"
				aria-pressed={activeType === type}
				aria-label={`filter by ${type}`}
				onClick={() => onToggle(type)}
				className={clsx(
					styles["Type-filter--chip"],
					activeType !== null &&
						activeType !== type &&
						styles["Type-filter--chip-dimmed"]
				)}
			>
				<TypeCard type={type} size="base" />
			</button>
		))}
	</div>
);
