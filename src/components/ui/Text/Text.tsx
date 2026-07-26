import clsx from "clsx";
import React from "react";
import styles from "./Text.module.css";

type TextVariant = "default" | "outlined" | "darker" | "error";
type TextSize = "base" | "large" | "xlarge";
type TextElement = "span" | "p" | "h1" | "h2" | "h3" | "h4";

interface ITextProps extends React.HTMLAttributes<HTMLParagraphElement> {
	variant?: TextVariant;
	size?: TextSize;
	as?: TextElement;
}

export const Text: React.FC<ITextProps> = ({
	children,
	variant = "default",
	size = "base",
	as = "p",
	className,
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
					: styles[`Shadow--light-${size}`],
				className
			)}
			{...props}
		>
			{children}
		</PixelatedText>
	);
};
