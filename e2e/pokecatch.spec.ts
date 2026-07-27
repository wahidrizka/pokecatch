import { test, expect, type Page } from "@playwright/test";
import fs from "fs";

const shot = (page: Page, name: string) =>
	page.screenshot({
		path: `e2e/__screenshots__/${test.info().project.name}/${name}.png`,
		fullPage: true,
	});

/**
 * Gulir bertahap satu layar sekaligus agar LazyLoadImage sempat ter-trigger,
 * lalu kembali ke atas. Menggulir langsung ke dasar bisa melewati gambar di tengah.
 *
 * Penantian gambar sengaja dibatasi dan boleh menyerah: sprite datang dari CDN
 * pihak ketiga dan satu-dua di antaranya kadang lambat. Kerusakan gambar diuji
 * terpisah lewat brokenImages(), yang tidak bergantung pada kecepatan jaringan.
 */
const settleLazyImages = async (page: Page) => {
	await page.evaluate(async () => {
		for (let y = 0; y <= document.body.scrollHeight; y += window.innerHeight) {
			window.scrollTo(0, y);
			await new Promise((resolve) => setTimeout(resolve, 150));
		}
		window.scrollTo(0, 0);
	});
	await page
		.waitForFunction(
			() => Array.from(document.images).every((img) => img.complete),
			undefined,
			{ timeout: 15_000 }
		)
		.catch(() => undefined);
};

/** Gambar yang sudah selesai dimuat tapi tidak punya dimensi = benar-benar rusak. */
const brokenImages = (page: Page) =>
	page
		.locator("img")
		.evaluateAll((imgs) =>
			imgs
				.filter((img) => {
					const image = img as HTMLImageElement;
					return image.complete && !image.naturalWidth;
				})
				.map((img) => (img as HTMLImageElement).src || "(src kosong)")
		);

const seedCollection = (page: Page, entries: { name: string; nickname: string }[]) =>
	page.addInitScript((seed) => {
		localStorage.setItem("pokecatch@myPokemon", JSON.stringify(seed));
	}, entries.map((entry) => ({ ...entry, sprite: "/static/pokeball.png" })));

test("start screen renders", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "PokeCatch" })).toBeVisible();
	await expect(page.getByRole("link", { name: /press start/i })).toBeVisible();

	await shot(page, "01-start-screen");
});

test("explore page loads live pokemon data", async ({ page }) => {
	await page.goto("/pokemons");

	const cards = page.locator('a[href^="/pokemon/"]');
	await expect(cards.first()).toBeVisible();
	expect(await cards.count()).toBe(50);
	await expect(page.getByRole("button", { name: /load more/i })).toBeVisible();

	// Membuktikan NEXT_PUBLIC_POKEMON_IMAGE_URL benar-benar resolve, bukan sekadar terpasang.
	await expect
		.poll(() =>
			cards
				.first()
				.locator("img")
				.evaluate((img: HTMLImageElement) => img.naturalWidth)
		)
		.toBeGreaterThan(0);

	await settleLazyImages(page);
	await shot(page, "02-explore");
});

test("stat bar never overflows its track, even at base stat 255", async ({ page }) => {
	await page.goto("/pokemon/blissey");

	const hpLabel = page.getByText("255", { exact: true });
	await expect(hpLabel).toBeVisible();

	const fill = hpLabel.locator("xpath=..");
	const track = fill.locator("xpath=..");
	const fillBox = await fill.boundingBox();
	const trackBox = await track.boundingBox();

	expect(fillBox).not.toBeNull();
	expect(trackBox).not.toBeNull();
	expect(fillBox!.width).toBeLessThanOrEqual(trackBox!.width + 1);

	await expect
		.poll(() =>
			page
				.locator('img[alt="blissey"]')
				.first()
				.evaluate((img: HTMLImageElement) => img.naturalWidth)
		)
		.toBeGreaterThan(0);

	await settleLazyImages(page);
	await shot(page, "03-stats-blissey");
});

test("catching a pokemon persists it and syncs the captured badge", async ({ page }) => {
	await page.addInitScript(() => {
		// Tangkapan sukses jika roll < peluang. 0.45 lolos baik pada peluang asli
		// pikachu (±70%) maupun default 0.5 bila species belum termuat saat klik,
		// dan tetap di atas ambang shiny (1/64) sehingga alurnya non-shiny.
		Math.random = () => 0.45;
	});

	await page.goto("/pokemon/pikachu");

	// Tombol Catch sudah ada sejak render pertama karena `loading` mulai dari false,
	// jadi tunggu hasil fetch dulu — mengklik lebih awal membuat urutan modal balapan.
	await expect
		.poll(() =>
			page
				.locator('img[alt="pikachu"]')
				.first()
				.evaluate((img: HTMLImageElement) => img.naturalWidth)
		)
		.toBeGreaterThan(0);

	await page.getByRole("button", { name: /catch/i }).click();
	await expect(page.getByText(/catching/i)).toBeVisible();
	await expect(page.getByText(/was caught/i)).toBeVisible();
	await page.getByPlaceholder("enter a nickname").fill("SPARKY");
	await page.getByRole("button", { name: /save/i }).click();
	await expect(page.getByText(/is now in your pokemon list/i)).toBeVisible();

	await shot(page, "04-caught");

	await page.getByRole("link", { name: /see my pokemon/i }).click();
	await expect(page.getByText("Total: 1")).toBeVisible();
	await expect(page.getByText("SPARKY")).toBeVisible();

	await shot(page, "05-my-pokemon");
});

test("releasing a pokemon updates the collection", async ({ page }) => {
	await seedCollection(page, [
		{ name: "PIKACHU", nickname: "SPARKY" },
		{ name: "EEVEE", nickname: "FLUFFY" },
	]);

	await page.goto("/my-pokemon");
	await expect(page.getByText("Total: 2")).toBeVisible();

	await page.getByRole("button", { name: "Release SPARKY" }).click();
	await page.getByRole("button", { name: /^release$/i }).click();

	await expect(page.getByText("Total: 1")).toBeVisible();
	await expect(page.getByText("SPARKY")).toBeHidden();
	await expect(page.getByText("FLUFFY")).toBeVisible();

	await shot(page, "06-after-release");
});

test("nav width follows viewport width, not viewport height", async ({ page, isMobile }) => {
	test.skip(Boolean(isMobile), "resizing the window is a desktop-only concern");

	await page.goto("/my-pokemon");
	const nav = page.locator("nav");
	await nav.waitFor();

	await page.setViewportSize({ width: 1280, height: 720 });
	const shortWindow = (await nav.boundingBox())!.width;

	await page.setViewportSize({ width: 1280, height: 1200 });
	const tallWindow = (await nav.boundingBox())!.width;

	expect(tallWindow).toBe(shortWindow);
});

test("a failed detail request surfaces a toast", async ({ page }) => {
	await page.route("**/api/v2/pokemon/**", (route) => route.abort());

	await page.goto("/pokemon/pikachu");

	await expect(page.getByText(/fail get pokemons/i)).toBeVisible();

	await shot(page, "07-error-toast");
});

for (const route of ["/", "/pokemons", "/pokemon/pikachu", "/my-pokemon"]) {
	test(`layout fits the viewport and serves every image: ${route}`, async ({ page }) => {
		const rejected: string[] = [];
		page.on("requestfailed", (request) => {
			if (request.resourceType() === "image") {
				rejected.push(`${request.failure()?.errorText} ${request.url()}`);
			}
		});
		page.on("response", (response) => {
			if (response.request().resourceType() === "image" && response.status() >= 400) {
				rejected.push(`HTTP ${response.status()} ${response.url()}`);
			}
		});

		await seedCollection(page, [{ name: "PIKACHU", nickname: "SPARKY" }]);
		await page.goto(route);
		await settleLazyImages(page);

		const { scrollWidth, innerWidth } = await page.evaluate(() => ({
			scrollWidth: document.documentElement.scrollWidth,
			innerWidth: window.innerWidth,
		}));
		expect(scrollWidth, `${route} meluber horizontal`).toBeLessThanOrEqual(innerWidth + 1);

		expect(await brokenImages(page), `${route} punya gambar rusak`).toEqual([]);
		expect(rejected, `${route} punya permintaan gambar yang gagal`).toEqual([]);
	});
}

test("searching reaches beyond the loaded page and clearing restores browse", async ({ page }) => {
	await page.goto("/pokemons");
	await expect(page.locator('a[href="/pokemon/bulbasaur"]')).toBeVisible();

	// Mewtwo ada di luar 50 pertama — hanya ditemukan bila cakupannya seluruh daftar.
	await page.getByLabel("search pokémon").fill("mewtwo");
	await expect(page.locator('a[href="/pokemon/mewtwo"]')).toBeVisible();
	await expect(page.locator('a[href="/pokemon/bulbasaur"]')).toBeHidden();

	await page.getByLabel("search pokémon").fill("");
	await expect(page.locator('a[href="/pokemon/bulbasaur"]')).toBeVisible();
	await expect(page.locator('a[href^="/pokemon/"]')).toHaveCount(50);
	await expect(page.getByRole("button", { name: /load more/i })).toBeVisible();
});

test("type filter intersects with search and toggles off", async ({ page }) => {
	await page.goto("/pokemons");
	await expect(page.locator('a[href="/pokemon/bulbasaur"]')).toBeVisible();

	// "char" sendirian memuat charjabug (tipe bug); irisan dengan FIRE menyaringnya keluar.
	await page.getByLabel("search pokémon").fill("char");
	await expect(page.locator('a[href="/pokemon/charjabug"]')).toBeVisible();

	await page.getByRole("button", { name: "filter by fire" }).click();
	await expect(page.locator('a[href="/pokemon/charmander"]')).toBeVisible();
	await expect(page.locator('a[href="/pokemon/charjabug"]')).toBeHidden();

	// Klik chip yang sama melepas filter: charjabug kembali.
	await page.getByRole("button", { name: "filter by fire" }).click();
	await expect(page.locator('a[href="/pokemon/charjabug"]')).toBeVisible();

	await page.getByLabel("search pokémon").fill("zzzz");
	await expect(page.getByText("No Pokémon found")).toBeVisible();
});

test("difficulty chip reflects real catch odds and misses break free", async ({ page }) => {
	await page.addInitScript(() => {
		// 0.999 melewati ambang peluang mana pun (maks 90%) sekaligus bukan shiny.
		Math.random = () => 0.999;
	});

	await page.goto("/pokemon/pikachu");
	await expect
		.poll(() =>
			page
				.locator('img[alt="pikachu"]')
				.first()
				.evaluate((img: HTMLImageElement) => img.naturalWidth)
		)
		.toBeGreaterThan(0);

	// Pikachu ber-capture_rate 190 -> label "easy" (bukan "very easy").
	await expect(page.getByText("easy", { exact: true })).toBeVisible();

	await page.getByRole("button", { name: /catch/i }).click();
	await expect(page.getByText(/catching/i)).toBeVisible();
	await expect(page.getByText(/broke free/i)).toBeVisible();
});

test("shiny encounter is flagged and lands in the collection with a badge", async ({ page }) => {
	await page.addInitScript(() => {
		// 0 selalu lolos ambang shiny (1/64) dan ambang tangkapan mana pun.
		Math.random = () => 0;
	});

	await page.goto("/pokemon/pikachu");
	await expect(page.locator('[class*="Shiny--chip"]')).toBeVisible();
	await expect
		.poll(() =>
			page
				.locator('img[alt="pikachu"]')
				.first()
				.evaluate((img: HTMLImageElement) => img.naturalWidth)
		)
		.toBeGreaterThan(0);

	await page.getByRole("button", { name: /catch/i }).click();
	await expect(page.getByText(/was caught/i)).toBeVisible();
	await page.getByPlaceholder("enter a nickname").fill("KILAU");
	await page.getByRole("button", { name: /save/i }).click();
	await expect(page.getByText(/is now in your pokemon list/i)).toBeVisible();

	await page.getByRole("link", { name: /see my pokemon/i }).click();
	await expect(page.getByText("KILAU")).toBeVisible();
	await expect(page.locator('[class*="Shiny-badge"]')).toBeVisible();
});

test("collection export downloads a restorable file and import merges", async ({ page }) => {
	await seedCollection(page, [{ name: "PIKACHU", nickname: "SPARKY" }]);
	await page.goto("/my-pokemon");
	await expect(page.getByText("Total: 1")).toBeVisible();

	const downloadPromise = page.waitForEvent("download");
	await page.getByRole("button", { name: /export/i }).click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toMatch(/^pokecatch-\d{4}-\d{2}-\d{2}\.json$/);

	// Isi file = bentuk penyimpanan, jadi hasil ekspor selalu bisa diimpor balik.
	const exported = JSON.parse(fs.readFileSync(await download.path(), "utf-8"));
	expect(exported).toEqual([
		expect.objectContaining({ name: "PIKACHU", nickname: "SPARKY" }),
	]);

	const payload = JSON.stringify([
		{ name: "EEVEE", nickname: "FLUFFY", sprite: "/static/pokeball.png" },
		{ name: "PIKACHU", nickname: "SPARKY" },
	]);
	await page.locator('input[type="file"]').setInputFiles({
		name: "backup.json",
		mimeType: "application/json",
		buffer: Buffer.from(payload),
	});

	await expect(
		page.getByText("1 imported, 1 skipped (nickname taken)")
	).toBeVisible();
	await expect(page.getByText("Total: 2")).toBeVisible();
	await expect(page.getByText("FLUFFY")).toBeVisible();
	await expect(page.getByText(/Pokédex: 2\/\d+/)).toBeVisible();
});

test("an invalid import file leaves the collection untouched", async ({ page }) => {
	await seedCollection(page, [{ name: "PIKACHU", nickname: "SPARKY" }]);
	await page.goto("/my-pokemon");
	await expect(page.getByText("Total: 1")).toBeVisible();

	await page.locator('input[type="file"]').setInputFiles({
		name: "rusak.json",
		mimeType: "application/json",
		buffer: Buffer.from("bukan json {{{"),
	});

	await expect(page.getByText("Invalid collection file")).toBeVisible();
	await expect(page.getByText("Total: 1")).toBeVisible();
});

test("collection cards open the species detail while release stays put", async ({ page }) => {
	await seedCollection(page, [{ name: "PIKACHU", nickname: "SPARKY" }]);
	await page.goto("/my-pokemon");

	// Tombol lepas di dalam Link tidak boleh ikut bernavigasi.
	await page.getByRole("button", { name: "Release SPARKY" }).click();
	await expect(page.getByText(/are you sure/i)).toBeVisible();
	expect(page.url()).toContain("/my-pokemon");
	await page.getByRole("button", { name: /cancel/i }).click();

	await page.locator('a[href="/pokemon/pikachu"]').click();
	await page.waitForURL("**/pokemon/pikachu");
	await expect(page.getByRole("heading", { name: "pikachu" })).toBeVisible();
});

test("pokedex entry and a linear evolution chain render", async ({ page }) => {
	await page.goto("/pokemon/charmander");

	await expect(page.getByText("Lizard Pokémon")).toBeVisible();
	// Teks mentah PokeAPI mengandung \n dari tata letak game; paragrafnya
	// harus sudah dinormalisasi jadi satu baris utuh.
	const flavor = page.locator('[class*="Pokedex--entry"] p');
	await expect(flavor).toBeVisible();
	expect(await flavor.innerText()).not.toContain("\n");

	// exact wajib: genus sebagian Pokemon berbunyi "Evolution Pokémon" dan
	// juga sebuah heading, sehingga pencocokan parsial jadi ambigu.
	await expect(
		page.getByRole("heading", { name: "Evolution", exact: true })
	).toBeVisible();
	await expect(page.locator('[class*="Evolution--stage"]')).toHaveCount(3);
	// Spesies yang sedang dibuka disorot, tepat satu.
	await expect(page.locator('[class*="Evolution--stage-current"]')).toHaveCount(1);

	await expect(
		page.getByRole("button", { name: /play charmander cry/i })
	).toBeVisible();

	await page.locator('a[href="/pokemon/charizard"]').click();
	await page.waitForURL("**/pokemon/charizard");
	await expect(page.getByRole("heading", { name: "charizard" })).toBeVisible();
});

test("a branching evolution chain lists every branch side by side", async ({ page }) => {
	await page.goto("/pokemon/eevee");

	await expect(
		page.getByRole("heading", { name: "Evolution", exact: true })
	).toBeVisible();
	// Eevee bercabang delapan: satu tahap dasar + delapan evolusi.
	await expect(page.locator('[class*="Evolution--stage"]')).toHaveCount(9);
	// Panah hanya sekali — cabang sejajar berdampingan tanpa panah berulang.
	await expect(page.getByText("→", { exact: true })).toHaveCount(1);
	await expect(page.locator('a[href="/pokemon/sylveon"]')).toBeVisible();
});
