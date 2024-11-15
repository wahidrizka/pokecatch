import React from "react";

import { Text } from "..";
import Link, { LinkProps } from "next/link";
import Image from "next/image";
import clsx from "clsx";

import styles from "./Button.module.css";

const ButtonVariants = ["light", "dark", "sky"] as const;
const ButtonSizes = ["large", "xlarge"] as const;

interface IButtonProps extends LinkProps {
	variant?: (typeof ButtonVariants)[number];
	size?: (typeof ButtonSizes)[number];
	icon?: string;
}

export const Button: React.FC<IButtonProps & React.PropsWithChildren> = ({
	children,
	variant = "sky",
	size = "large",
	icon,
	...props
}) => {
	return (
		<Link
			className={clsx(
				"pixelated-border",
				styles[`Button`],
				styles[`Button--Variant-${variant}`]
			)}
			{...props}
		>
			{icon && (
				<Image
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
	);
};
