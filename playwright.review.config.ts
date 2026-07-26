import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

/**
 * Harness review visual: memotret tiap rute pada tiap device ke e2e/__review__/
 * untuk diperiksa manusia. Sengaja dipisah dari suite utama karena ia tidak
 * menegaskan apa pun — artefaknya yang dinilai, bukan hasil lulus/gagalnya.
 */
export default defineConfig({
	...base,
	testIgnore: undefined,
	testMatch: /review\.spec\.ts/,
	retries: 0,
});
