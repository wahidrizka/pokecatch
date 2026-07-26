"use client";
import { useEffect } from "react";

const DEFAULT_TITLE = "PokeCatch";

export const useDocumentTitle = (title: string) => {
	useEffect(() => {
		document.title = title;

		return () => {
			document.title = DEFAULT_TITLE;
		};
	}, [title]);
};
