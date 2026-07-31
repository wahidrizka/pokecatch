"use client";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context";
import { getAllPokemon, getPokemonByType } from "@/services/pokemon";
import { PokemonType } from "@/types/pokemon";

/*
 * PokeAPI tidak punya endpoint pencarian fuzzy, jadi daftar nama lengkap
 * (±1351 entri, ±90KB) diambil sekali lalu difilter di client. Pengambilan
 * ditunda sampai pengguna benar-benar mencari atau memfilter, supaya
 * kunjungan browse biasa tidak menanggung biayanya.
 */
const FETCH_ALL_LIMIT = 100000;

export const usePokemonSearch = () => {
	const { state } = useGlobalContext();
	const [query, setQuery] = useState("");
	const [activeType, setActiveType] = useState<string | null>(null);
	const [allPokemon, setAllPokemon] = useState<PokemonType[]>([]);
	const [typeMembers, setTypeMembers] = useState<Set<string> | null>(null);
	const [pendingFetches, setPendingFetches] = useState(0);

	const hasRequestedAll = useRef(false);
	const activeTypeRef = useRef<string | null>(null);
	const typeCache = useRef(new Map<string, Set<string>>());

	const ensureAllPokemonLoaded = async () => {
		if (hasRequestedAll.current) return;
		hasRequestedAll.current = true;

		setPendingFetches((count) => count + 1);
		try {
			const page = await getAllPokemon(FETCH_ALL_LIMIT, 0);
			setAllPokemon(page.results);
		} catch {
			hasRequestedAll.current = false;
			toast.error("Oops!. Fail get pokemons. Please try again!");
		} finally {
			setPendingFetches((count) => count - 1);
		}
	};

	const search = (value: string) => {
		setQuery(value);
		if (value.trim()) void ensureAllPokemonLoaded();
	};

	const toggleType = async (type: string) => {
		const next = activeTypeRef.current === type ? null : type;
		activeTypeRef.current = next;
		setActiveType(next);

		if (!next) {
			setTypeMembers(null);
			return;
		}

		void ensureAllPokemonLoaded();

		const cached = typeCache.current.get(next);
		if (cached) {
			setTypeMembers(cached);
			return;
		}

		setPendingFetches((count) => count + 1);
		try {
			const response = await getPokemonByType(next);
			const members = new Set(
				response.pokemon.map((entry) => entry.pokemon.name)
			);
			typeCache.current.set(next, members);

			// Terapkan hanya bila pengguna belum berpindah pilihan selama menunggu.
			if (activeTypeRef.current === next) setTypeMembers(members);
		} catch {
			if (activeTypeRef.current === next) {
				activeTypeRef.current = null;
				setActiveType(null);
				setTypeMembers(null);
			}
			toast.error("Oops!. Fail get pokemons. Please try again!");
		} finally {
			setPendingFetches((count) => count - 1);
		}
	};

	const isFiltering = query.trim() !== "" || activeType !== null;

	const results = useMemo(() => {
		if (!isFiltering) return [];

		const needle = query.trim().toLowerCase();
		const capturedOf = (name: string) =>
			state.pokemonSummary.find((entry) => entry.name === name.toUpperCase())
				?.captured ?? 0;

		return allPokemon
			.filter((pokemon) => !needle || pokemon.name.includes(needle))
			.filter((pokemon) => !typeMembers || typeMembers.has(pokemon.name))
			.map((pokemon) => ({ ...pokemon, captured: capturedOf(pokemon.name) }));
	}, [isFiltering, query, allPokemon, typeMembers, state.pokemonSummary]);

	return {
		query,
		search,
		activeType,
		toggleType,
		results,
		isFiltering,
		isSearchLoading: pendingFetches > 0,
	};
};
