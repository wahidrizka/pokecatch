import React from "react";
import { Text } from "../Text";
import clsx from "clsx";
import styles from "./Loading.module.css";

export const Loading: React.FC<{ label?: string }> = ({ label }) => {
	return (
		<div className={clsx(styles["loading"], styles["svg"])}>
			<svg
				width="40"
				height="40"
				viewBox="0 0 40 40"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M19 15H21V17H19V15Z" fill={"var(--base-color-gray-600)"} />
				<path
					d="M19 12H17V10H15V12H17V14H19V12Z"
					fill={"var(--base-color-gray-600)"}
				/>
				<path d="M19 12V10H21V12H19Z" fill={"var(--base-color-gray-600)"} />
				<path d="M21 14V12H23V14H21Z" fill={"var(--base-color-gray-600)"} />
				<path d="M23 12V10H25V12H23Z" fill={"var(--base-color-gray-600)"} />
				<path d="M21 23H19V25H21V23Z" fill={"var(--base-color-gray-600)"} />
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M31 2H9V8H11V16H13V18H15V22H13V24H11V32H9V38H31V32H29V24H27V22H25V18H27V16H29V8H31V2ZM29 34H11V36H29V34ZM29 4V6H11V4H29ZM27 26H25V24H23V22H21V18H23V16H25V14H27V8H13V14H15V16H17V18H19V22H17V24H15V26H13V30H14V28H16V26H18V28H19V30H20V28H19V26H21V28H22V27H24V29H25V30H27V26ZM22 29H23V30H22V29Z"
					fill={"var(--base-color-gray-600)"}
				/>
			</svg>
			{label && (
				<Text
					variant="outlined"
					size="large"
					style={{ textTransform: "uppercase" }}
				>
					{label}
				</Text>
			)}
		</div>
	);
};
