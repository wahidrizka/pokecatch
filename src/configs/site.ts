/*
 * Cerminan logika Next sendiri (resolve-url.ts): pratinjau memakai URL cabang,
 * produksi memakai domain produksi. Semuanya variabel yang diisi Vercel, jadi
 * tidak ada domain yang ditulis tangan dan tidak ada variabel baru yang bisa
 * lupa diisi saat deploy.
 *
 * Dipakai untuk metadataBase sekaligus sitemap dan robots. Fallback bawaan Next
 * tidak cukup: fallback itu hanya berlaku untuk gambar sosial, sehingga tanpa
 * metadataBase eksplisit og:url dan canonical tetap relatif — dan og:url yang
 * relatif tidak sah. Terbukti saat build: og:url terbit sebagai "/".
 */
const vercelHost =
	process.env.VERCEL_ENV === "preview"
		? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
		: process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = vercelHost
	? `https://${vercelHost}`
	: `http://localhost:${process.env.PORT || 3000}`;

export const SITE_NAME = "PokeCatch";

export const SITE_DESCRIPTION =
	"Explore, view, and capture Pokémon from the Pokémon universe!";

/*
 * Persegi, jadi cocok untuk kartu ringkas yang dipakai kedua platform. Juga
 * jadi cadangan halaman Pokemon yang tidak punya artwork resmi.
 */
export const SITE_SHARE_IMAGE = {
	url: "/static/pokeball-transparent.png",
	width: 870,
	height: 870,
	alt: SITE_NAME,
};
