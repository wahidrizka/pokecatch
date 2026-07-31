import { VT323 } from "next/font/google";

/*
 * Di-host sendiri, bukan lewat @import ke Google Fonts. Pengukuran menunjukkan
 * pertukaran font dari font cadangan ke VT323 adalah satu-satunya penyebab
 * pergeseran tata letak di /pokemons: memblokir permintaan fontnya menurunkan
 * CLS dari 0.214 ke 0. Angka nol itu hasil percobaan diagnostik, bukan yang
 * dikirim — next/font menyertakan font cadangan yang metriknya sudah
 * disetarakan, dan CLS /pokemons yang benar-benar terukur sesudahnya 0.084.
 *
 * Dipakai bersama root layout dan global-error. global-error menggantikan root
 * layout ketika layout itu sendiri gagal, jadi ia merender <html> miliknya
 * sendiri dan tidak mewarisi apa pun — termasuk variabel font ini.
 *
 * Tanpa memuatnya di kedua tempat, `font-family: var(--font-vt323), monospace`
 * di globals.css menjadi tidak sah pada halaman galat. Yang muncul bukan
 * monospace di sebelahnya, melainkan font bawaan peramban: var() ke properti
 * yang tak terdefinisi tanpa nilai cadangan membatalkan seluruh deklarasi,
 * bukan hanya entri itu. Terukur: judulnya terbit sebagai Times New Roman.
 */
export const pixelFont = VT323({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
	variable: "--font-vt323",
});
