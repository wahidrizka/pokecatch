import { defineConfig, devices } from "@playwright/test";

// Port khusus e2e supaya tidak pernah menempel ke dev server lain yang kebetulan hidup di :3000.
const E2E_PORT = 3100;
const E2E_URL = `http://localhost:${E2E_PORT}`;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	workers: process.env.CI ? 2 : 3,
	retries: process.env.CI ? 2 : 1,
	timeout: 60_000,
	expect: { timeout: 20_000 },
	// Harness review visual dijalankan lewat playwright.review.config.ts, bukan di sini:
	// ia menghasilkan artefak untuk diperiksa manusia, bukan menguji apa pun.
	testIgnore: /review\.spec\.ts/,
	reporter: [["list"]],
	use: {
		baseURL: E2E_URL,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{ name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
		{ name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } },
		{ name: "desktop-safari", use: { ...devices["Desktop Safari"] } },
		{ name: "tablet-ipad", use: { ...devices["iPad Pro 11"] } },
		{ name: "mobile-android", use: { ...devices["Pixel 5"] } },
		{ name: "mobile-ios", use: { ...devices["iPhone 12"] } },
	],
	webServer: {
		command: `npm run dev -- --port ${E2E_PORT}`,
		url: E2E_URL,
		reuseExistingServer: false,
		timeout: 120_000,
		// SITE_URL membaca PORT untuk menyusun URL absolut di canonical, og:url,
		// sitemap, dan robots. Tanpa ini semuanya menyebut :3000 sementara server
		// melayani :3100, dan test metadata menguji alamat yang salah.
		env: { PORT: String(E2E_PORT) },
	},
});
