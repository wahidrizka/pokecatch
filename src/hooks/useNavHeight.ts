"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Navbar melayang di atas konten, jadi tiap halaman menyisakan ruang bawah
 * setinggi navbar. Tingginya diukur setelah render pertama.
 */
export const useNavHeight = () => {
	const navRef = useRef<HTMLDivElement>(null);
	const [navHeight, setNavHeight] = useState(0);

	useEffect(() => {
		setNavHeight(navRef.current?.clientHeight ?? 0);
	}, []);

	return { navRef, navHeight };
};
