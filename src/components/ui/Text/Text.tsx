import clsx from "clsx";
import React from "react";
import styles from "./Text.module.css";

const TextVariants = ["default", "outlined", "darker", "error"] as const;
const TextSizes = ["base", "large", "xlarge"] as const;
const TextElements = ["span", "p", "h1", "h2", "h3", "h4"] as const;

interface ITextProps extends React.HTMLAttributes<HTMLParagraphElement> {
	variant?: (typeof TextVariants)[number];
	size?: (typeof TextSizes)[number];
	as?: (typeof TextElements)[number];
}

export const Text: React.FC<ITextProps> = ({
	children,
	variant = "default",
	size = "base",
	as = "p",
	...props
}) => {
	const PixelatedText = as;
	return (
		<PixelatedText
			className={clsx(
				styles[`Variant--${variant}`],
				styles[`Size--${size}`],
				variant === "outlined"
					? styles[`Shadow--bold-${size}`]
					: styles[`Shadow--light-${size}`]
			)}
			{...props}
		>
			{children}
		</PixelatedText>
	);
};
