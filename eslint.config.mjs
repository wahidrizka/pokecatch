import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

/**
 * eslint-config-next 15.x masih berformat eslintrc dan belum mengekspor flat
 * config, jadi FlatCompat dipakai untuk membungkusnya. Kalau nanti naik ke
 * eslint-config-next 16+, bungkus ini bisa dilepas dan diganti impor langsung.
 */
const compat = new FlatCompat({
	baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
			"e2e/__screenshots__/**",
			"e2e/__review__/**",
			"test-results/**",
			"playwright-report/**",
		],
	},
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "error",
		},
	},
];

export default eslintConfig;
