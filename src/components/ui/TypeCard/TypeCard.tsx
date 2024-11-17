import React from "react";
import { Text } from "../Text";
import clsx from "clsx";
import styles from "./TypeCard.module.css";

type TypeCardType = {
	type: string;
};

export const TypeCard: React.FC<TypeCardType> = ({ type }) => {
	return (
		<div
			className={clsx(
				"pixelated-border",
				styles["Type--card"],
				styles[`Type--card-color--${type}`]
			)}
		>
			<Text variant="outlined" size="large">
				{type}
			</Text>
		</div>
	);
};
