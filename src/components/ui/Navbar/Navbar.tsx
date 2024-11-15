import React from "react";
import clsx from "clsx";
import styles from "./Navbar.module.css";
import { NavItem } from "./NavItem";

type NavbarType = {
	children?: React.ReactNode;
	fadeHeight?: number;
};

export const Navbar = React.forwardRef<HTMLDivElement, NavbarType>(
	({ fadeHeight = 124, children }, ref) => {
		return (
			<div
				className={clsx(styles["Gradient-backdrop"])}
				style={{
					height: fadeHeight,
					background:
						"linear-gradient(180deg, #FDFDFD 0%, rgba(253, 253, 253, 0) 0.01%, rgba(253, 253, 253, 0.97) 30.37%, #FDFDFD 100%)",
				}}
				ref={ref}
			>
				<nav className={clsx(styles["Outer-nav"])}>
					{children}
					<div className={clsx(styles["Inner-nav"])}>
						<NavItem href="/pokemons" label="Pokemons" />
						<NavItem href="/my-pokemon" label="My Pokemon" variant="light" />
					</div>
				</nav>
			</div>
		);
	}
);

Navbar.displayName = "Navbar";
