"use client";
import { useEffect, useRef, useState } from "react";

export type CatchPhase = "idle" | "throwing" | "caught" | "escaped" | "naming";

const THROW_DURATION_MS = 2000;
const RESULT_DURATION_MS = 1200;

// Dipakai bila peluang asli tidak tersedia (mis. fetch species gagal).
const DEFAULT_CATCH_PROBABILITY = 0.5;

/**
 * Urutan lempar pokeball: melempar → hasil ditampilkan sesaat → memberi nama
 * kalau tertangkap, atau kembali diam kalau lolos.
 */
export const useCatchSequence = () => {
	const [phase, setPhase] = useState<CatchPhase>("idle");
	const pending = useRef<ReturnType<typeof setTimeout>[]>([]);

	useEffect(() => {
		const timeouts = pending.current;
		return () => timeouts.forEach(clearTimeout);
	}, []);

	const wait = (duration: number) =>
		new Promise<void>((resolve) => {
			pending.current.push(setTimeout(resolve, duration));
		});

	const throwPokeball = async (
		probability: number = DEFAULT_CATCH_PROBABILITY
	) => {
		setPhase("throwing");
		await wait(THROW_DURATION_MS);

		const caught = Math.random() < probability;
		setPhase(caught ? "caught" : "escaped");
		await wait(RESULT_DURATION_MS);

		setPhase(caught ? "naming" : "idle");
	};

	return { phase, throwPokeball };
};
