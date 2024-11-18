import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
	placeholder,
	...props
}) => {
	return (
		<div
			className={clsx("pixelated-border no-inset", styles["Pixelated--input"])}
		>
			<input placeholder={placeholder} {...props} />
		</div>
	);
};
