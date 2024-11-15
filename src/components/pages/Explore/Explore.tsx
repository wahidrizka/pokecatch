/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { createRef } from "react";
import clsx from "clsx";
import styles from "./Explore.module.css";
import { Text } from "@/components/ui";

export const Explore: React.FC = () => {
	const navRef = createRef<HTMLDivElement>();

	const [navHeight, setNavHeight] = React.useState<number>(0);

	React.useEffect(() => {
		setNavHeight(navRef.current?.clientHeight as number);
	}, []);
	return (
		<>
			<div
				className={clsx(styles["Container"])}
				style={{ marginBottom: navHeight }}
			>
				<Text
					as="h1"
					variant="outlined"
					size="large"
					style={{ fontWeight: "bold" }}
				>
					Browse the list of Pokémon and discover their unique abilities and
					stats.
				</Text>
			</div>
		</>
	);
};
