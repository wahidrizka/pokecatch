import type { Metadata } from "next";
import "@/styles/globals.css";
import { GlobalProvider } from "@/context";
import { pixelFont } from "@/configs/fonts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SHARE_IMAGE, SITE_URL } from "@/configs/site";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: [
		"pokemon game",
		"catch pokemon",
		"pokedex",
		"free pokemon game",
		"online pokemon game",
	],
	manifest: "/site.webmanifest",
	alternates: { canonical: "/" },
	robots: { index: true, follow: true },
	openGraph: {
		type: "website",
		siteName: SITE_NAME,
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		url: "/",
		images: [SITE_SHARE_IMAGE],
	},
	twitter: {
		card: "summary",
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		images: [SITE_SHARE_IMAGE],
	},
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
		<html lang="en" className={pixelFont.variable}>
			<body>
				<GlobalProvider>{children}</GlobalProvider>
				<Toaster position="top-center" />
			</body>
		</html>
	);
}
