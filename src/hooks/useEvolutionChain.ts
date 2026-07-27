"use client";
import { useEffect, useState } from "react";
import { getEvolutionChain } from "@/services/pokemon";
import { EvolutionChainNodeType } from "@/types/pokemon";
import { getPokemonId } from "@/utils";

export type EvolutionStage = {
	name: string;
	/** ID spesies dipakai langsung sebagai ID gambar, seperti di PokemonCard. */
	id: string;
	/** Kedalaman dari spesies dasar: 0 = awal rantai. */
	depth: number;
};

const flatten = (
	node: EvolutionChainNodeType,
	depth = 0
): EvolutionStage[] => [
	{ name: node.species.name, id: getPokemonId(node.species.url), depth },
	...node.evolves_to.flatMap((next) => flatten(next, depth + 1)),
];

/**
 * Merata-kan rantai evolusi yang rekursif menjadi daftar berurut. Cabang
 * dirender berdampingan (Eevee: satu tahap 0 lalu delapan tahap 1), jadi
 * kedalaman cukup untuk menempatkan panah tanpa perlu struktur pohon di UI.
 */
export const useEvolutionChain = (chainUrl: string | null) => {
	const [stages, setStages] = useState<EvolutionStage[]>([]);

	useEffect(() => {
		if (!chainUrl) {
			setStages([]);
			return;
		}

		let subscribed = true;

		getEvolutionChain(getPokemonId(chainUrl))
			.then((data) => {
				if (subscribed) setStages(flatten(data.chain));
			})
			.catch(() => {
				// Degradasi: tanpa rantai, seksi evolusi tidak dirender.
			});

		return () => {
			subscribed = false;
		};
	}, [chainUrl]);

	// Rantai satu simpul berarti spesies ini tidak berevolusi — tak perlu dirender.
	return { stages: stages.length > 1 ? stages : [] };
};
