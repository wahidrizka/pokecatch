"use client";
import clsx from "clsx";
import Link from "next/link";
import React, { ButtonHTMLAttributes } from "react";
import styles from "./Navbar.module.css";
import { Text } from "../Text";
import { usePathname } from "next/navigation";

type NavItemType = {
	variant?: "light" | "dark" | "sky";
	href: string;
	label: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type StyleType = {
	variant?: "light" | "dark" | "sky";
	matched: boolean;
	children?: React.ReactNode;
};

const PixelatedNavItem = ({
	className,
	variant,
	matched,
	children,
	...props
}: StyleType & ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			className={clsx(
				styles["Pixelated-NavItem"],
				matched
					? styles[`Pixelated-NavItem--variant-${variant}--matched`]
					: styles[`Pixelated-NavItem--variant-${variant}`],
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
};

export const NavItem: React.FC<NavItemType> = ({
	variant = "sky",
	label,
	href,
}) => {
	const pathname = usePathname();
	const matched = pathname === href;
	return (
		<Link href={href} className={clsx(styles["NavItem-link"])}>
			<PixelatedNavItem
				className={clsx("pixelated-border")}
				variant={variant}
				matched={matched ? true : false}
			>
				<Text variant="outlined" size="large">
					{label}
				</Text>
			</PixelatedNavItem>
		</Link>
	);
};
