# PokeCatch

A small browser game built on [PokeAPI](https://pokeapi.co): browse the Pokédex, throw a Pokéball, name what you catch, and keep a collection.

There is no backend and no account. The collection lives in the browser's `localStorage`, so it stays on the device that caught them.

## Features

- **Browse and search** every Pokémon in the API, not only the ones already loaded, with a filter for all 18 types.
- **Detail pages** with base stats, types, abilities, moves, the Pokédex entry, the evolution chain, and the Pokémon's cry.
- **Catch odds that follow the games.** Each species' `capture_rate` is mapped onto a 10–90% band, so a legendary really is harder to catch than a Caterpie, and a chip tells you which one you are facing.
- **Shiny encounters** at the usual 1/64, rolled once per visit to a detail page.
- **Collection management**: nickname on capture, release, and export or import the whole collection as JSON.

## Requirements

Node.js 20 or newer. 18.18+ also works; CI runs on 22.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open <http://localhost:3000>.

### Environment variables

Both are required:

```
NEXT_PUBLIC_POKEMON_API_URL=https://pokeapi.co/api/v2/pokemon
NEXT_PUBLIC_POKEMON_IMAGE_URL=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon
```

Two things are worth knowing about them:

- They are **inlined at build time**, so changing `.env.local` means restarting the dev server or rebuilding.
- If they are missing, **nothing errors**. Requests fall back to a relative URL, the app receives its own HTML in reply, and the Pokémon list simply comes up empty. Every other endpoint the app uses is derived from these two, so there is nothing else to configure.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, without emitting |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run test:review` | Screenshot every route on every device, for review by eye |

## Testing

The Playwright suite runs against **the real PokeAPI**, not fixtures, so a broken environment or a changed response shape fails the tests instead of hiding behind a mock. It covers six targets — Chrome, Firefox, and Safari on desktop, plus iPad Pro 11, Pixel 5, and iPhone 12 — and includes a guard that fails if a page grows wider than the viewport or serves a broken image.

The suite uses port 3100 and always starts its own server, so it never attaches to whatever happens to be running on port 3000.

```bash
npm run test:e2e
npx playwright test --grep "stat bar"   # one scenario
npx playwright test --ui                # interactive
```

## Project structure

```
src/
  app/         routes only — each one delegates to a page component
  components/
    pages/     one component per route, where the composition lives
    ui/        shared pixel-art building blocks
  hooks/       data fetching and state
  services/    the only place that talks to PokeAPI
  helpers/     the localStorage collection, import and export
  context/     browse results and capture counts, shared app-wide
  configs/     endpoints and site metadata, all derived from the two env vars
  utils/       pure functions
  types/       PokeAPI response shapes
  styles/      design tokens as CSS custom properties
```

Data flows one way: **services → hooks → components**. Services throw, hooks turn failures into toasts, and components only render what a hook hands them.

## Tech

Next.js 15 (App Router) · React 18 · TypeScript · CSS Modules · axios · Playwright

Styling is plain CSS Modules over custom properties — no utility framework, no CSS-in-JS. The pixel-art borders are an SVG data URI applied through `border-image`.

## License

[MIT](LICENSE) © 2024 wahidrizka
