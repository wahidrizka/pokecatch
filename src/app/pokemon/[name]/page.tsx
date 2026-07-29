import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { PokemonDetail } from "@/components";
import { POKEMON_ARTWORK_IMAGE } from "@/configs/api";
import { SITE_DESCRIPTION } from "@/configs/site";
import {
	getDetailPokemon,
	getPokemonSpecies,
	isNotFoundError,
} from "@/services/pokemon";
import { getEnglishFlavorText, getEnglishGenus, toDisplayName } from "@/utils";

type PokemonDetailPageProps = {
	params: Promise<{ name: string }>;
};

const ARTWORK_SIZE = 475;
const MAX_DESCRIPTION_LENGTH = 160;

const truncate = (text: string) =>
	text.length <= MAX_DESCRIPTION_LENGTH
		? text
		: `${text.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`;

/*
 * cache() menyatukan permintaan generateMetadata dan komponen halaman menjadi
 * satu panggilan per kunjungan; keduanya berjalan dalam render yang sama.
 */
const loadPokemon = cache(async (name: string) => {
	const pokemon = await getDetailPokemon(name).catch((error: unknown) => {
		// Hanya 404 yang berarti Pokemonnya tidak ada. Gangguan jaringan dilempar
		// lagi supaya tidak diberitakan sebagai halaman yang tidak pernah ada.
		if (isNotFoundError(error)) notFound();
		throw error;
	});

	// Degradasi sama seperti di halamannya: tanpa species, deskripsi jatuh ke umum.
	const species = await getPokemonSpecies(pokemon.species.name).catch(
		() => null
	);

	return { pokemon, species };
});

/*
 * Isi halaman tetap diambil di peramban; yang pindah ke server hanya metadata.
 * Tanpa ini setiap Pokemon berbagi judul "PokeCatch" yang sama dan pratinjau
 * tautannya kosong, karena perayap tidak menjalankan JavaScript.
 */
export const generateMetadata = async ({
	params,
}: PokemonDetailPageProps): Promise<Metadata> => {
	const { name } = await params;
	const { pokemon, species } = await loadPokemon(name);

	const displayName = toDisplayName(pokemon.name);
	const genus = species ? getEnglishGenus(species) : "";
	const flavorText = species ? getEnglishFlavorText(species) : "";
	const description =
		truncate([genus && `${displayName} — ${genus}.`, flavorText].join(" ").trim()) ||
		SITE_DESCRIPTION;

	const images = [
		{
			url: `${POKEMON_ARTWORK_IMAGE}/${pokemon.id}.png`,
			width: ARTWORK_SIZE,
			height: ARTWORK_SIZE,
			alt: displayName,
		},
	];
	const url = `/pokemon/${pokemon.name}`;

	return {
		title: displayName,
		description,
		alternates: { canonical: url },
		openGraph: {
			type: "article",
			title: displayName,
			description,
			url,
			images,
		},
		twitter: { card: "summary", title: displayName, description, images },
	};
};

export default async function PokemonDetailPage({
	params,
}: PokemonDetailPageProps) {
	const { name } = await params;

	// notFound() dari generateMetadata ditelan Next: halaman untuk nama yang tidak
	// ada tetap terbit dengan status 200. Panggilan ini yang benar-benar memicu
	// 404-nya, dan cache() membuatnya tidak berbiaya permintaan tambahan.
	await loadPokemon(name);

	return <PokemonDetail name={name} />;
}
