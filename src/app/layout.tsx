import type { Metadata } from "next";
import "@/styles/globals.css";
import { GlobalProvider } from "@/context";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: "PokeCatch",
	description: "Explore, view, and capture Pokémon from the Pokémon universe!",
	keywords: [
		"Pokemon games, play Pokemon games, catch Pokemon, free Pokemon games, online Pokemon games, new Pokemon games, best Pokemon games, Pokemon games for kids, Pokemon games for adults",
	],
	manifest: "/site.webmanifest",
	icons: [
		{ rel: "icon", url: "/favicon/favicon.ico" },
		{
			rel: "apple-touch-icon",
			url: "/favicon/apple-touch-icon.png",
			sizes: "180x180",
		},
		{ rel: "icon", url: "/favicon/favicon-32x32.png", sizes: "32x32" },
		{ rel: "icon", url: "/favicon/favicon-16x16.png", sizes: "16x16" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<GlobalProvider>{children}</GlobalProvider>
				<Toaster position="top-center" />
			</body>
		</html>
	);
}
