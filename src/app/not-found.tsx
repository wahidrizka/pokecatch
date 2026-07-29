import { Button, ErrorScreen } from "@/components";

export default function NotFound() {
	return (
		<ErrorScreen
			code="404"
			title="It got away!"
			description="This Pokémon fled, or the page you asked for never existed."
		>
			<Button href="/pokemons">Explore</Button>
			<Button href="/" variant="light">
				Home
			</Button>
		</ErrorScreen>
	);
}
