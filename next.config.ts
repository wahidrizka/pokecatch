import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

/*
 * Daftar origin diturunkan dari pengamatan lalu lintas nyata keempat rute,
 * bukan dugaan: yang benar-benar dimuat halaman hanyalah dirinya sendiri,
 * PokeAPI (xhr), serta repo PokeAPI di raw.githubusercontent.com — yang
 * memasok gambar sekaligus suara Pokemon. Font ikut di-host sendiri, jadi
 * tidak ada satu pun origin pihak ketiga yang boleh memuat kode atau gaya.
 *
 * 'unsafe-inline' pada script-src tidak terhindarkan tanpa nonce, dan nonce
 * menuntut middleware yang membuat setiap rute dirender dinamis. Untuk aplikasi
 * tanpa auth dan tanpa data pengguna di server, harganya lebih besar dari
 * manfaatnya. 'unsafe-eval' dan ws: hanya di dev, tempat HMR membutuhkannya.
 */
const contentSecurityPolicy = [
	"default-src 'self'",
	`script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
	"style-src 'self' 'unsafe-inline'",
	"font-src 'self'",
	// data: dipakai border-image SVG milik .pixelated-border
	"img-src 'self' data: https://raw.githubusercontent.com",
	"media-src 'self' https://raw.githubusercontent.com",
	`connect-src 'self' https://pokeapi.co${isDevelopment ? " ws:" : ""}`,
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"object-src 'none'",
].join("; ");

const securityHeaders = [
	{ key: "Content-Security-Policy", value: contentSecurityPolicy },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
	},
	// preload sengaja tidak dipakai: itu komitmen permanen yang sulit dibatalkan.
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains",
	},
];

const nextConfig: NextConfig = {
	headers: async () => [{ source: "/:path*", headers: securityHeaders }],
};

export default nextConfig;
