"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context";
import { getAllPokemon } from "@/services/pokemon";

const PAGE_SIZE = 50;

export const usePokemonList = () => {
	const { state, setState } = useGlobalContext();
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const hasRequested = useRef(false);

	const loadMore = useCallback(async () => {
		setIsLoading(true);

		try {
			const loaded = state.pokemons ?? [];
			const page = await getAllPokemon(PAGE_SIZE, loaded.length);

			const capturedOf = (name: string) =>
				state.pokemonSummary?.find((entry) => entry.name === name.toUpperCase())
					?.captured ?? 0;

			setState({
				pokemons: [
					...loaded,
					...page.results.map((result) => ({
						name: result.name,
						url: result.url,
						captured: capturedOf(result.name),
					})),
				],
			});
			setHasMore(Boolean(page.next));
		} catch {
			toast.error("Oops!. Fail get pokemons. Please try again!");
		} finally {
			setIsLoading(false);
		}
	}, [state, setState]);

	useEffect(() => {
		if (hasRequested.current || state.pokemons?.length) return;

		hasRequested.current = true;
		loadMore();
	}, [state.pokemons, loadMore]);

	return { pokemons: state.pokemons ?? [], isLoading, hasMore, loadMore };
};
