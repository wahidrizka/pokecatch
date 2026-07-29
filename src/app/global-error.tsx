"use client";
import "@/styles/globals.css";
import { Button, ErrorScreen } from "@/components";

/*
 * Menggantikan root layout saat layout itu sendiri gagal, jadi html dan body
 * harus dirender sendiri. Hanya tombol coba lagi yang ditawarkan: tautan
 * bergantung pada router yang belum tentu hidup sejauh ini.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
	return (
		<html lang="en">
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
