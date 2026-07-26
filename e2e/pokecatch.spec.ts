import { test, expect, type Page } from "@playwright/test";

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
		Math.random = () => 0.99; // catchPokemon() menangkap jika Math.random() >= 0.5
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
