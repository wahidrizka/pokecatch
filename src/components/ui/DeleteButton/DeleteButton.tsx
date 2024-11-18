import clsx from "clsx";
import React from "react";
import styles from "./DeleteButton.module.css";

export const DeleteButton: React.FC<
	React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ ...props }) => {
	return (
		<button
			className={clsx("pixelated-border", styles["Delete--button"])}
			{...props}
		>
			<svg
				width="14"
				height="14"
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M0 0H3V3H0V0ZM6 6H3V3H6V6ZM9 6H6V9H3V12H0V15H3V12H6V9H9V12H12V15H15V12H12V9H9V6ZM12 3V6H9V3H12ZM12 3V0H15V3H12Z"
					fill="var(--base-color-red-400)"
				/>
			</svg>
		</button>
	);
};
