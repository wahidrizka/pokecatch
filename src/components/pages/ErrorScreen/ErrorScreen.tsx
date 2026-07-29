import clsx from "clsx";
import React from "react";
import styles from "./ErrorScreen.module.css";
import { Text } from "@/components";

interface IErrorScreenProps {
	code: string;
	title: string;
	description: string;
}

/**
 * Layar bersama untuk 404 dan galat. Tindakannya dititipkan lewat children
 * karena tiap pemakainya berbeda: 404 menawarkan tautan, batas galat menawarkan
 * tombol coba lagi yang hanya ada di komponen client.
 */
export const ErrorScreen: React.FC<
	IErrorScreenProps & React.PropsWithChildren
> = ({ code, title, description, children }) => (
	<section className={clsx(styles["Container"])}>
		<div className={clsx(styles["Centered"])}>
			<Text
				as="h1"
				variant="outlined"
				size="xlarge"
				style={{ fontWeight: "bold" }}
			>
				{code}
			</Text>
			<Text as="h2" variant="outlined" size="large">
				{title}
			</Text>
			<Text
				variant="outlined"
				size="base"
				className={clsx(styles["Description"])}
			>
				{description}
			</Text>
			<div className={clsx(styles["Actions"])}>{children}</div>
		</div>
	</section>
);
