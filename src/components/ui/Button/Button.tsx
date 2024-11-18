"use client";
import React from "react";
import { Text } from "..";
import Link, { LinkProps } from "next/link";
import clsx from "clsx";

import styles from "./Button.module.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ButtonVariants = ["light", "dark", "sky"] as const;
const ButtonSizes = ["large", "xlarge"] as const;

interface IButtonProps extends Partial<LinkProps> {
	variant?: (typeof ButtonVariants)[number];
	size?: (typeof ButtonSizes)[number];
	icon?: string;
	as?: "a" | "button";
	type?: "button" | "submit" | "reset";
}

export const Button: React.FC<IButtonProps & React.PropsWithChildren> = ({
	children,
	variant = "sky",
	size = "large",
	icon,
	as = "a", // Default to "a" (Link)
	type = "button",
	...props
}) => {
	const commonClasses = clsx(
		"pixelated-border",
		styles[`Button`],
		styles[`Button--Variant-${variant}`]
	);

	return as === "a" ? (
		<Link className={commonClasses} {...(props as LinkProps)}>
			{icon && (
				<LazyLoadImage
					src={icon}
					alt="button icon"
					width={size === "xlarge" ? 40 : 20}
					height={size === "xlarge" ? 40 : 20}
				/>
			)}
			<Text variant="outlined" size={size}>
				{children}
			</Text>
		</Link>
	) : (
		<button
			className={commonClasses}
			type={type}
			{...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{icon && (
				<LazyLoadImage
					src={icon}
					alt="button icon"
					width={size === "xlarge" ? 40 : 20}
					height={size === "xlarge" ? 40 : 20}
				/>
			)}
			<Text variant="outlined" size={size}>
				{children}
			</Text>
		</button>
	);
};
