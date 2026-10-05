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

`dist/` is the deployable build. `docs/previews/playable-preview.html` is a self-contained preview that can be opened directly in a browser. Images, fonts, JavaScript, and CSS are embedded in that preview.

## Structure

- `src/App.vue`: game HUD, input controls, in-game map, dialogs, fullscreen, and lifecycle.
- `src/game/world.ts`: fixed game resolution, movement, gravity, platform landing, camera, and pixel rendering.
- `src/components/PortfolioPanel.vue`: all portfolio content and project details.
- `src/data/`: existing portfolio content.
- `src/index.css`: game stage and accessible HTML overlays.

Existing `/projects/:slug` URLs open the matching project inside the game. Existing section hash links open that area. `/portfolio` opens the in-game map. Apache deployment can use the existing `public/.htaccess` history fallback.

Upload the contents of `dist/` to the hosting document root. No Node server is needed in production. The original PHP API files remain in the repository but are not required for the game.
