# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite HMR)
npm run build     # production build → dist/
npm run preview   # preview the production build
npm run lint      # ESLint check
```

There are no tests configured.

## Architecture

**Misión Memoria Espacial** is a space-themed memory-matching card game in Spanish. Stack: React 19 + Vite 7, plain JavaScript (JSX — no TypeScript).

### Source layout

All game logic and every component live in a single file: `src/App.jsx`. There is no component folder structure. `src/styles.css` contains all CSS. `src/main.jsx` is the entry point only. The `src/a/` directory holds backup copies of those two files and is not part of the build.

### Game state (all in `App`)

The top-level `App` component owns all state:

| State | Values | Purpose |
|---|---|---|
| `phase` | `"menu"` \| `"playing"` | Which screen is shown |
| `introStep` | `"gate"` \| `"video"` \| `"hidden"` | One-time intro overlay flow |
| `mode` | `"single"` \| `"duo"` | 1 or 2 player |
| `difficulty` | `"4x4"` \| `"6x6"` | 8 pairs or 18 pairs |
| `deck` | `Card[]` | Shuffled array with `matched` flag |
| `flipped` | `string[]` | IDs of currently face-up cards (max 2) |
| `locked` | `boolean` | Blocks clicks during match evaluation |

Best scores are persisted to `localStorage` under `mme-best-4x4` and `mme-best-6x6` (single-player only).

### Card image system

On mount, `discoverCardImages()` runs:
1. Fetches `/cards/cards.json` — if present and valid, uses `data.images[]`
2. Otherwise probes `/cards/card-01.png` … `/cards/card-24.png` via `new Image()` load checks

If enough images are found (≥ pairs required), `buildDeck()` uses them. Otherwise it falls back to the 18 inline SVG icon components (`Planet`, `Saturn`, `Rocket`, …).

### Static assets (`public/`)

| Path | Purpose |
|---|---|
| `/cards/card-NN.png` | Card face images (01–24) |
| `/cards/cards.json` | Optional explicit image list (`{ "images": [...] }`) |
| `/ui/card-back.png` | Card back artwork (CSS `background`) |
| `/video/intro-mision.mp4` | Optional intro video (gracefully skipped if missing) |
| `/video/intro-mision_poster.jpg` | Optional video poster |

### CSS theming

All CSS is in `src/styles.css`. The dark space palette uses CSS custom properties on `:root`. Player-turn color theming is driven by a `data-turn` attribute on `.wrap` (`"p1"` = blue, `"p2"` = red, `"none"` = transparent).

### Responsive grid

The custom hook `useResponsiveGrid(cols, rows)` measures available viewport space via refs on the header, stats bar, and footer elements, then computes `cell` size and `gap` so the board fills the screen on any device and orientation.

### ESLint

Flat config (ESLint 9). The `no-unused-vars` rule uses `varsIgnorePattern: '^[A-Z_]'` to allow the SVG icon components (which are stored in the `ICONS` array rather than referenced by name).
