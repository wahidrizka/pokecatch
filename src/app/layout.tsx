import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
	title: "PokeCatch",
	description: "Explore, view, and capture Pokémon from the Pokémon universe!",
	keywords: [
		"Pokemon games, play Pokemon games, catch Pokemon, free Pokemon games, online Pokemon games, new Pokemon games, best Pokemon games, Pokemon games for kids, Pokemon games for adults",
	],
	icons: [
		{ rel: "icon", url: "/favicon/favicon.ico" },
		{
			rel: "apple-touch-icon",
			url: "/favicon/apple-touch-icon.png",
			sizes: "180x180",
		},
		{ rel: "icon", url: "/favicon/icon-32x32.png", sizes: "32x32" },
		{ rel: "icon", url: "/favicon/icon-16x16.png", sizes: "16x16" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="font-pixelated">
			<body>{children}</body>
		</html>
	);
}
