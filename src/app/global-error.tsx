"use client";
import "@/styles/globals.css";
import { Button, ErrorScreen } from "@/components";
import { pixelFont } from "@/configs/fonts";

/*
 * Menggantikan root layout saat layout itu sendiri gagal, jadi html, body, dan
 * variabel fontnya harus dipasang sendiri — tidak ada yang diwarisi dari sana.
 * Hanya tombol coba lagi yang ditawarkan: tautan bergantung pada router yang
 * belum tentu hidup sejauh ini.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
	return (
		<html lang="en" className={pixelFont.variable}>
			<body>
				<ErrorScreen
					code="Oops"
					title="A wild error appeared"
					description="The page could not be loaded. Try again."
				>
					<Button as="button" onClick={reset}>
						Try again
					</Button>
				</ErrorScreen>
			</body>
		</html>
	);
}
