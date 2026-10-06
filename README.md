# Aldrin’s World

A standalone 2D pixel game portfolio built with Vue 3, TypeScript, Vite, and KAPLAY. The game renders at **1920 × 1080** and scales uniformly to the browser. Non-16:9 screens are letterboxed. The portfolio lives in in-game panels; there is no separate website layout or scroll-driven movement.

## Run

```sh
npm install
npm run dev
```

## Controls

- Left/right arrows or A/D: walk.
- Up arrow, Space, or W: jump.
- E: explore a nearby landmark.
- Escape: close the current panel.
- Map: travel to any portfolio area.
- Touch: hold left/right buttons and tap jump.

The game pauses while a panel is open. Keyboard state clears when the browser loses focus. Stepping stones support jumping and landing. All portfolio areas are also accessible through the map, without precise movement.

## Build and preview

```sh
npm run build
npm run lint
npm run export:preview
```

`dist/` is the deployable build. `docs/previews/game/` is a portable preview folder. Run `npx vite preview --outDir docs/previews/game` to open it. PNGs, fonts, JavaScript, and CSS remain separate files; images are never embedded as base64.

## Structure

- `src/App.vue`: game HUD, input controls, in-game map, dialogs, fullscreen, and lifecycle.
- `src/game/world.ts`: fixed game resolution, movement, gravity, platform landing, camera, and pixel rendering.
- `src/components/PortfolioPanel.vue`: all portfolio content and project details.
- `src/data/`: existing portfolio content.
- `src/index.css`: game stage, transparent interaction layer, and PNG-backed interfaces.
- `src/components/PngIcon.vue`: named frames from the original tech-stack PNG atlas.

## PNG interfaces

Opening a landmark displays its original poster, journal, inventory, achievement board, or contact desk directly over the dimmed game world. The native dialog provides focus trapping and Escape handling but has no visible background, border, or surrounding container. Navigation and close controls use the same PNG artwork.

Tools, projects, and achievements support search, category filters, and pagination. Add entries to their existing files in `src/data/`; no repainting or fixed total-item limit is required. The original six technology sprites are loaded from `public/assets/ui/tech-stack.png`. Tools without dedicated artwork use text monograms until a matching PNG frame is added. SQL is shared by MySQL and PostgreSQL.

Desktop layouts preserve each full PNG composition. Narrow screens and short landscape screens reflow content using PNG borders at readable text sizes. Opening a panel pauses gameplay; closing it returns focus and resumes movement. The contact desk prepares an email draft in the visitor’s email app.

The original pack remains in `public/assets/aldrin-game-ui-pack/` as reference material; its procedural renderer is not imported by the game.

Existing `/projects/:slug` URLs open the matching project inside the game. Existing section hash links open that area. `/portfolio` opens the in-game map. Apache deployment can use the existing `public/.htaccess` history fallback.

Upload the contents of `dist/` to the hosting document root. No Node server is needed in production. The original PHP API files remain in the repository but are not required for the game.
