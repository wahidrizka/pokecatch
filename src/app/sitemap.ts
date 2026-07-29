import type { MetadataRoute } from "next";
import { SITE_URL } from "@/configs/site";
import { getAllPokemon } from "@/services/pokemon";

/* Daftar Pokemon hampir tak pernah berubah; sehari sekali sudah berlebih. */
export const revalidate = 86400;

const ALL_POKEMON = 100000;

/*
 * /my-pokemon sengaja tidak masuk: isinya hanya ada di localStorage peramban
 * masing-masing, jadi yang dilihat perayap selalu keadaan kosong.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { results } = await getAllPokemon(ALL_POKEMON);

	return [
		{ url: SITE_URL, changeFrequency: "monthly", priority: 1 },
		{ url: `${SITE_URL}/pokemons`, changeFrequency: "weekly", priority: 0.8 },
		...results.map((pokemon) => ({
			url: `${SITE_URL}/pokemon/${pokemon.name}`,
			changeFrequency: "yearly" as const,
			priority: 0.5,
		})),
	];
}
