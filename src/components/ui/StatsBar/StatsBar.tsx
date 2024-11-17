import React from "react";
import { Text } from "../Text";

interface StatsBarType {
	color?: string;
	progress?: number;
	height?: string | number;
}

export const StatsBar: React.FC<StatsBarType> = ({
	color = "hp",
	progress = "50",
	height = "24",
}) => {
	const BarWrapper: React.CSSProperties = {
		height: `${height}px`,
		width: "50%",
		backgroundColor: "var(--base-color-gray-300",
		marginLeft: "20px",
	};
	const BarProgress: React.CSSProperties = {
		height: "100%",
		width: `${progress}%`,
		backgroundColor: `var(--base-statsbar-${color}-color`,
		textAlign: "right",
	};

	return (
		<div style={BarWrapper}>
			<div style={BarProgress}>
				<Text variant="outlined">{`${progress}%`}</Text>
			</div>
		</div>
	);
};
