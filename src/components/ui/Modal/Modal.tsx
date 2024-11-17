import React, { HTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./Modal.module.css";

type ModalType = {
	open: boolean;
	overlay?: "dark" | "light" | "error";
	solid?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Modal: React.FC<ModalType> = ({
	children,
	open,
	overlay = "dark",
	solid,
}) => {
	return open ? (
		<>
			<div
				className={clsx(
					styles["Overlay"],
					styles[`Overlay--bg-${overlay}`],
					styles[`Overlay--opacity-${solid}`],
					styles[`Overlay--zIndex-${open}`]
				)}
			>
				<div
					className={clsx(styles["Content"], styles[`Content--zIndex-${open}`])}
				>
					<div>{children}</div>
				</div>
			</div>
		</>
	) : null;
};
