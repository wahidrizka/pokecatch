import { PokemonDetail } from "@/components";

export default async function PokemonDetailPage({
	params,
}: {
	params: Promise<{ name: string }>;
}) {
	const name = (await params).name;
	return <PokemonDetail name={name} />;
}
