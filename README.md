# Aldrin’s World

A standalone 2D pixel game portfolio built with Vue 3, TypeScript, Vite, and KAPLAY. The game fills the available browser viewport, including **1920 × 1080**, without letterboxing. Pixel art scales uniformly; wider screens reveal more scenery. Portrait screens show extra sky while keeping the character and ground visible. The portfolio lives in in-game panels; there is no separate website layout or scroll-driven movement.

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
- Touch: drag the joystick and tap Jump with the other thumb.

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
- `src/game/world.ts`: adaptive viewport, movement, gravity, platform landing, camera, and pixel rendering.
- `src/components/PortfolioPanel.vue`: all portfolio content and project details.
- `src/data/`: existing portfolio content.
- `src/index.css`: game stage, transparent interaction layer, and PNG-backed interfaces.
- `src/components/PngIcon.vue`: named frames from the original tech-stack PNG atlas.

## PNG interfaces

Opening a landmark displays its original poster, journal, inventory, achievement board, or contact desk directly over the dimmed game world. The native dialog provides focus trapping and Escape handling but has no visible background, border, or surrounding container. Navigation and close controls use the same PNG artwork.

Tools, projects, and achievements support search, category filters, and pagination. Add entries to their existing files in `src/data/`; no repainting or fixed total-item limit is required. All 15 listed tools now use PNG sprites from `public/assets/ui/tech-stack-v2.png`. The 4 × 4 atlas uses 64-pixel cells; its frame map is `public/assets/ui/tech-stack-v2.json`. The six original sprites are preserved, with eight generated additions including React, MongoDB, Figma, and WordPress. SQL is shared by MySQL and PostgreSQL. Unmapped future entries may still use a text monogram. See [atlas notes and generation prompt](docs/tech-stack-atlas.md).

Desktop layouts preserve each full PNG composition. Tool captions have reserved space inside desktop slots; compact inventory layouts place captions below the framed icon, wrapping longer names without crossing the artwork. Narrow screens and short landscape screens reflow content using PNG borders at readable text sizes. Opening a panel pauses gameplay; closing it returns focus and resumes movement. The contact desk prepares an email draft in the visitor’s email app.

The original pack remains in `public/assets/aldrin-game-ui-pack/` as reference material; its procedural renderer is not imported by the game.

Existing `/projects/:slug` URLs open the matching project inside the game. Existing section hash links open that area. `/portfolio` opens the in-game map. Apache deployment can use the existing `public/.htaccess` history fallback.

Upload the contents of `dist/` to the hosting document root. No Node server is needed in production. The original PHP API files remain in the repository but are not required for the game.

## Playing on a phone

Touch-capable devices show a sideways-phone prompt in portrait. Rotating to landscape dismisses it automatically; **Continue in portrait** keeps the portfolio available without requiring rotation. No orientation permission, sensor access, or fullscreen lock is required.

- Drag the left joystick to walk. A small center dead zone prevents accidental movement; dragging farther increases walking speed.
- Tap **Jump** with the other thumb while holding the joystick. **Explore** opens the nearby landmark.
- Releasing or cancelling the touch stops movement. Opening a panel, rotating, switching apps, or losing focus clears held input. Returning from an overlay never resumes an old drag.
- Controls sit inside the device safe areas. Keyboard controls remain available, including on touch devices with a connected keyboard.

The orientation prompt, pointer lifecycle, simultaneous touches, and viewport layouts can be checked in browser touch emulation. Physical iOS/Android testing is still needed for notch insets, browser chrome, and actual thumb comfort.

## Sound and music

Tap **Sound** in the game menu to enable an original, gentle chiptune loop and effects for jumping, landing, opening/closing panels, map travel, and UI selections. Sound starts off for new visitors and only starts after interaction. Open **? → Sound & music** for separate music/effect switches and a volume slider; preferences are remembered on this browser.

Music becomes quieter while reading portfolio panels. All audio stops while the page is hidden, the window loses focus, or the rotation prompt is open; returning resumes music without replaying old effects. `src/game/audio.ts` generates the original theme and effects with Web Audio, so no external recordings, downloads, or audio dependencies are needed.

Browser tests cover audio output, mute, independent switches, persistence, and focus changes. Physical iOS/Android checks are still needed for browser chrome resizing, safe-area insets, audio interruptions, and listening comfort.
