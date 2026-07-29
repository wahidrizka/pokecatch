"use client";
import { Button, ErrorScreen } from "@/components";

/*
 * error sengaja tidak diambil dari props: tidak ada layanan pemantauan untuk
 * mengirimnya, dan menampilkannya ke pengguna tidak menolong siapa pun.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
	return (
		<ErrorScreen
			code="Oops"
			title="A wild error appeared"
			description="Something went wrong on the way here. Try again, or head back."
		>
			<Button as="button" onClick={reset}>
				Try again
			</Button>
			<Button href="/" variant="light">
				Home
			</Button>
		</ErrorScreen>
	);
}
