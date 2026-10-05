# Scalable game interfaces

The v2 preview uses content-driven HTML layouts and nine-slice pixel borders. It is no longer limited to six inventory items or three achievements. Projects now have a separate collection screen.

## What scales

- Tools, projects, achievements and experience read arrays from `public/assets/ui/portfolio-data.json`.
- Search and category filters work across the complete collection, not just the current page.
- Pagination renders up to 12 cards at a time by default; configure `pageSize` as needed.
- Grid columns respond to available space. On desktop the inspector sits beside the grid; on narrow screens it moves below it.
- Long lists and details scroll inside the panel. The outer panel stays within the viewport.
- Pixel borders use nine-slice scaling so adding content does not require enlarging or regenerating the art.
- The preview includes a clearly labeled 36-item sample-data toggle, including cases that require multiple pages. Turning it off restores the real examples.

## Integration

Import the CSS and controller into your current application. Mount the overlay once above your existing game canvas. Load the same atlases already in the pack:

```js
import { createGameUI } from './lib/scalable-game-ui.js';
import { createProceduralCanvas } from './lib/game-ui-atlas.js';
import './lib/scalable-game-ui.css';

const base = `${import.meta.env.BASE_URL}assets/ui/`;
async function json(name) {
  const response = await fetch(base + name);
  if (!response.ok) throw new Error(`Could not load ${name}`);
  return response.json();
}

const [data, tech, medals] = await Promise.all([
  json('portfolio-data.json'), json('tech-stack.json'), json('medals.json'),
]);
data.about.photo = base + data.about.photo;

// Use procedural pixels to create the icon images once; no PNG fetches.
function iconURL(atlas, frame) {
  const cached = createProceduralCanvas(atlas, frame);
  const canvas = document.createElement('canvas');
  canvas.width = cached.width;
  canvas.height = cached.height;
  canvas.getContext('2d').drawImage(cached, 0, 0);
  return canvas.toDataURL();
}
const icons = {};
for (const atlas of [tech, medals]) {
  for (const frame of Object.keys(atlas.frames)) icons[frame] = iconURL(atlas, frame);
}

const host = document.createElement('div');
document.body.append(host);
const ui = createGameUI(host, {
  data,
  icons,
  skins: {
    about: base + 'about.png',
    experience: base + 'about.png',
    tools: base + 'tools.png',
    projects: base + 'tools.png',
    achievements: base + 'achievements.png',
    contact: base + 'about.png',
  },
  pageSize: 12,
  // Connect these hooks to your existing game pause/input state:
  onOpen: () => { gamePaused = true; },
  onClose: () => { gamePaused = false; },
});

// At the appropriate world object:
ui.open('tools');
// Other names: about, experience, projects, achievements, contact.
// On component unmount: ui.destroy(); host.remove();
```

`gamePaused` in that example represents your existing game state; define it or replace those hooks with your controller. This pack has not edited your project. In Vue, mount the overlay after its host element exists and destroy it on unmount. The controller handles Escape and keeps keyboard focus inside the open panel; pause the underlying game input through the hooks as well.

The example uses PNG border textures for convenience. To eliminate those requests too, load each section atlas JSON and call `iconURL(atlas, 'panel')` for its skin URL. The standalone preview uses this all-procedural path for borders and icons. Your actual portrait remains a normal image.

## Add entries

Append objects to the appropriate array in `portfolio-data.json`. Each item needs a unique stable `id` within its section. Useful fields are:

| Field | Meaning |
| --- | --- |
| id | Unique item key |
| title | Display name |
| category | Filter group |
| subtitle | Year, role or short context |
| description | Inspector text; long content scrolls |
| icon | Key in the supplied icons map |
| mark | Text fallback when no icon exists |
| tags | Optional array of short labels |
| url | Optional http, https or mailto destination |
| linkLabel | Optional link text |

For example, a project entry can have `id: 'my-next-project'`, `title: 'My next project'`, `category: 'Web'` and your description. New tech-stack entries can use a text fallback immediately; add their pixel icon to an atlas when ready. Adding an item never requires repainting the inventory background.

Update an already mounted UI without recreating it:

```js
const updatedTools = [...data.tools, {
  id: 'new-tool', title: 'New tool', category: 'Workflow',
  mark: 'NT', description: 'Describe how you use this tool.',
}];
ui.updateData({ tools: updatedTools });
```

The static `ui.regions` rectangles in the original atlases describe the original fixed illustrations only. The scalable controller deliberately uses normal layout flow instead of those rectangles. Its nine-slice border insets are 32 source pixels on every side, recorded in `ui.scalable`; the center is not stretched or drawn. Text, cards and backgrounds fill the center independently.

## Rebuild the standalone preview

After editing `portfolio-data.json`, run `node reference/build-scalable-preview.cjs` from the extracted pack's root. This refreshes both `preview.html` and `scalable-preview.html` without resetting your edited data. No dependencies are required. `reference/build-preview.cjs` is retained only for the earlier fixed-layout illustration preview.

## Limits and checks

Verified the six icon frame bounds, exact PNG/procedural visible-pixel match, unique sample IDs, collection filtering, pagination with 37 entries, empty results and page clamping. Preview JavaScript syntax was checked. Browser interaction and mobile layout testing remain pending because a browser binary was unavailable in this environment.

The contact example copies a letter; it does not submit one. Education entries come from your supplied screenshot, while experience/projects are editable project examples. Medal colors do not imply achievement rankings.
