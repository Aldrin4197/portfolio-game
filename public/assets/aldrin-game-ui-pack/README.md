# Aldrin’s World — scalable game UI pack, v2

Start with `preview.html` (or `scalable-preview.html`). This updated version includes a responsive, searchable, paginated inventory, Projects collection, achievement board and experience journal, plus About and Contact interfaces. Pixel technology icons are already installed.

Read `SCALABLE-UI.md` for integration and data editing. Add entries to `public/assets/ui/portfolio-data.json`; there is no fixed six-item limit. `src/lib/scalable-game-ui.js` and its CSS provide the overlay. The atlas pack still supports both PNG and procedural pixel rendering.

The illustrated PNG previews below show the original fixed compositions. The new scalable layout uses their outer pixel frames with a flexible content area. Its interactive preview includes a 36-item sample-data switch.

---

# Aldrin's World — in-game UI pack

Five close-up portfolio interfaces, each with a separate PNG and JSON atlas, plus a three-medal icon atlas. The art matches the muted wood, slate, mint and parchment palette of your game. These are section interfaces, rather than scenery props.

Open `preview.html` directly in a browser. It is self-contained and needs no build step, network request or package installation. Select a section along the bottom. Inspect medals and tools, page through the journal, or copy a contact letter. The renderer button compares PNG and procedural drawing. Escape closes the current panel. On narrow phones, the illustrated panel scrolls horizontally to preserve text size and geometry.

## Section designs

| Section | Interface | Atlas files |
| --- | --- | --- |
| About | Pinned biography poster with your actual portrait | about.png / about.json |
| Experience | Open quest journal with selectable entries | experience.png / experience.json |
| Achievements | Close-up noticeboard with medals and certificate cards | achievements.png / achievements.json |
| Tools of the trade | Six-slot inventory with an inspection card | tools.png / tools.json |
| Contact | Letter-writing desk, envelope and editable form | contact.png / contact.json |
| Reusable icons | Bronze, silver and gold achievement medals | medals.png / medals.json |

## Add to an existing project

Merge `public/assets/ui/` into your public assets and copy `src/lib/game-ui-atlas.js` into your source folder. You do not need to replace your procedural world renderer, controls, physics or player.

Every main panel uses a 384 × 256 logical canvas. Scale uniformly: 3× gives 1152 × 768 pixels. Each atlas contains the exact `frames.panel` rectangle plus named `ui.regions` for HTML text, images and interaction hitboxes. These are fixed-aspect panels, **not nine-slice textures**; do not stretch width and height independently. The icon atlas has three 48 × 64 cells.

### PNG-free procedural rendering

Each atlas JSON includes a palette and horizontal pixel runs. These encode the same artwork as its packed PNG. Draw the JSON once into a cached canvas, then draw that canvas as part of your existing render loop. There is no PNG fetch in this path:

```js
import { createProceduralCanvas } from './lib/game-ui-atlas.js';

// Vite uses BASE_URL for projects deployed under a subdirectory.
const base = `${import.meta.env.BASE_URL}assets/ui/`;
const response = await fetch(`${base}achievements.json`);
if (!response.ok) throw new Error('Could not load achievement UI');
const atlas = await response.json();
const panel = createProceduralCanvas(atlas, 'panel');

// In your current render loop, after drawing the world:
ctx.save();
ctx.imageSmoothingEnabled = false;
ctx.drawImage(panel, panelX, panelY, 1152, 768);
ctx.restore();
```

This is data-driven procedural drawing using fillRect, not hand-authored vector geometry. It preserves the supplied artwork rather than dynamically regenerating the design. The user's real portrait remains a separate photo (`aldrin-photo.png`) to preserve its appearance; it is not encoded as procedural pixels.

### PNG drawing

Use `drawPNG(ctx, image, atlas, 'panel', x, y, scale)` from the same helper after loading the atlas image. The helper disables smoothing while drawing. Use a separate HTML overlay for accessible text, selectable objects and form controls, as demonstrated in the preview.

### Named UI areas and pointer mapping

All `ui.regions` coordinates are relative to the 384 × 256 panel canvas. To position HTML, divide x and width by 384 and y and height by 256, then use percentages within the panel container. The supplied `hitTestRegion` helper accounts for uniform fit and letterboxing; its point and panelRect must use the same coordinate space (for example clientX/clientY and getBoundingClientRect).

The JSON `frames` and `meta` follow common atlas field conventions. `ui` and `procedural` are custom extensions consumed by the included helper. Engine-specific animation loaders may need an adapter. These section atlases contain static art; interaction is supplied by the JavaScript and HTML.

## Content and behavior

- About uses your existing `me.png` portrait, copied unchanged.
- The education entries are transcribed from your supplied screenshot. Medal colors are decorative and do not represent academic rankings or verified awards.
- Experience currently presents Aadi, ICT planning and this portfolio as project examples. It does not invent employment titles, employers or dates. Replace these examples with your actual career entries if you want a job timeline.
- Tool descriptions are editable examples based on the projects discussed. They do not claim proficiency scores.
- Contact copies the composed letter locally; it sends nothing. Connect it to your real contact endpoint or email address before labeling it “Send.” No contact address was invented.
- The preview is a reference implementation; your actual project was not available here and has not been modified.

## Atlas schema

`frames.<name>.frame` gives x, y, w and h. `spriteSourceSize` and `sourceSize` describe the untrimmed frame. `pivot` is normalized to 0–1. `meta.size` is the exact PNG size. `procedural.palette` stores CSS RGBA hex colors, and each run is `[x, y, width, paletteIndex]`, one pixel high; omitted pixels are transparent.

The separate medal frames are `bronze`, `silver` and `gold`. For example, `createProceduralCanvas(medalAtlas, 'gold')` produces a standalone gold-medal canvas.

## Files and editability

- `preview.html`: standalone reference preview containing the assets and sample content.
- `src/lib/game-ui-atlas.js`: reusable render and hit-test helpers.
- `public/assets/ui/`: six PNG atlases, their JSON files, the original portrait and a manifest.
- `reference/preview-template.html`: readable preview source. Its PACK_DATA and RENDERER markers are build-time insertion points; use preview.html for the ready-to-open version.
- `reference/build-preview.cjs`: regenerates the standalone preview from the package files using Node, with no dependencies.

The illustrations were generated with ImageGen, then mechanically packed at consistent logical dimensions and encoded as palette runs. Text, controls and the real photo remain independent layers so they can be edited without regenerating the background art.

## Validation

Verified all six atlases, frame and interaction-region bounds, exact visible-pixel equivalence between procedural and PNG rendering, and preview JavaScript syntax. Illustrated overviews were inspected. Full browser interaction and responsive layout testing could not run because a browser binary was unavailable in this environment; test the supplied preview in your browser before integrating.
