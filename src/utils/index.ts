import { PokemonSpeciesResponseType } from "@/types/pokemon";

export const getPokemonId = (url: string) => {
	const urlSplit = url.split("/");
	if (urlSplit?.length) return urlSplit[urlSplit.length - 2];

	return "";
};

/** Teks Pokedex PokeAPI mengandung \n dan \f dari tata letak game aslinya. */
export const normalizeFlavorText = (text: string) => text.split(/\s+/).join(" ");

/**
 * Entri terakhir = teks dari game paling baru. Dipakai bersama oleh isi halaman
 * dan deskripsi metadata, supaya keduanya tidak mungkin menyimpang.
 */
export const getEnglishFlavorText = (species: PokemonSpeciesResponseType) => {
	const english = species.flavor_text_entries.filter(
		(entry) => entry.language.name === "en"
	);

	return english.length
		? normalizeFlavorText(english[english.length - 1].flavor_text)
		: "";
};

export const getEnglishGenus = (species: PokemonSpeciesResponseType) =>
	species.genera.find((entry) => entry.language.name === "en")?.genus ?? "";

/** Diam saja bila gagal: berkas hilang atau peramban menolak memutar. */
export const playCry = (src: string) => {
	void new Audio(src).play().catch(() => undefined);
};

const MAX_CAPTURE_RATE = 255;

/*
 * capture_rate asli (3-255) dipetakan linear ke pita 10%-90%: urutan
 * kesulitan game aslinya terjaga, semua tetap bisa ditangkap, dan tidak
 * ada yang pasti tertangkap. Mewtwo (3) ±11%, starter (45) ±24%,
 * Pikachu (190) ±70%, Caterpie (255) 90%.
 */
export const getCatchProbability = (captureRate: number) =>
	0.1 + (captureRate / MAX_CAPTURE_RATE) * 0.8;

export type CatchDifficulty =
	| "very easy"
	| "easy"
	| "medium"
	| "hard"
	| "legendary";

export const getCatchDifficulty = (captureRate: number): CatchDifficulty => {
	if (captureRate <= 15) return "legendary";
	if (captureRate <= 45) return "hard";
	if (captureRate <= 120) return "medium";
	if (captureRate <= 200) return "easy";
	return "very easy";
};
