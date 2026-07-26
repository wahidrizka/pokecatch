import { test, expect, type Page } from "@playwright/test";

const settle = async (page: Page) => {
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

const naturalWidthOf = (page: Page, selector: string) =>
	page
		.locator(selector)
		.first()
		.evaluate((img: HTMLImageElement) => img.naturalWidth);

const ROUTES: [string, string, (page: Page) => Promise<unknown>][] = [
	["start", "/", (page) =>
		expect(page.getByRole("heading", { name: "PokeCatch" })).toBeVisible()],
	["explore", "/pokemons", async (page) => {
		await expect(page.locator('a[href^="/pokemon/"]')).toHaveCount(50);
		await expect.poll(() => naturalWidthOf(page, 'a[href^="/pokemon/"] img')).toBeGreaterThan(0);
	}],
	["detail", "/pokemon/pikachu", (page) =>
		expect.poll(() => naturalWidthOf(page, 'img[alt="pikachu"]')).toBeGreaterThan(0)],
	["collection", "/my-pokemon", (page) =>
		expect(page.getByText("Total: 2")).toBeVisible()],
];

for (const [label, route, ready] of ROUTES) {
	test(`review ${label}`, async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				"pokecatch@myPokemon",
				JSON.stringify([
					{ name: "PIKACHU", nickname: "SPARKY", sprite: "/static/pokeball.png" },
					{ name: "EEVEE", nickname: "FLUFFY", sprite: "/static/pokeball.png" },
				])
			);
		});
		await page.goto(route);
		// Indikator dev Next.js menempel di pojok kiri bawah dan menutupi konten aplikasi.
		await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
		await ready(page);
		await settle(page);
		await page.screenshot({
			path: `e2e/__review__/${label}-${test.info().project.name}.png`,
		});
	});
}
