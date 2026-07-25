import React from "react";
import clsx from "clsx";
import { Text } from "../Text";
import styles from "./StatsBar.module.css";

const MAX_BASE_STAT = 255;

interface StatsBarType {
	color?: string;
	progress?: number;
	height?: number;
}

export const StatsBar: React.FC<StatsBarType> = ({
	color = "hp",
	progress = 0,
	height = 24,
}) => {
	const filledRatio = Math.min(Math.max(progress, 0) / MAX_BASE_STAT, 1);

	return (
		<div className={clsx(styles["Track"])} style={{ height }}>
			<div
				className={clsx(styles["Fill"])}
				style={{
					width: `${filledRatio * 100}%`,
					backgroundColor: `var(--base-statsbar-${color}-color)`,
				}}
			>
				<Text variant="outlined">{progress}</Text>
			</div>
		</div>
	);
};
