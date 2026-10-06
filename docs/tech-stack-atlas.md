# Technology sprite atlas

The active atlas is `public/assets/ui/tech-stack-v2.png`, a transparent 256 × 256 PNG containing 64 × 64 cells in a 4 × 4 grid. `tech-stack-v2.json` provides pixel-coordinate frames. `PngIcon.vue` uses those same frame positions for CSS background sampling; assets remain separate PNG files.

| Row | Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- | --- |
| 1 | javascript | vue | laravel | flutter |
| 2 | git | sql | react | mongodb |
| 3 | figma | wordpress | php | nodejs |
| 4 | api | embedded | unused | unused |

MySQL and PostgreSQL share the existing SQL database sprite. All 15 current tool entries have PNG artwork; text monograms are only a fallback for future entries without a mapped key.

The six original sprites were copied unchanged from `tech-stack.png`. Eight additional sprites were generated with the built-in image-generation tool, then mechanically cropped from their grid cells, fit inside 48 × 48 pixels with nearest-neighbor sampling, and centered in transparent 64 × 64 cells. No runtime generation or image-to-base64 conversion is used. The original atlas remains available for reference.

## Generation prompt

Use case: stylized-concept. Asset type: production transparent PNG sprite atlas for a cozy retro pixel-art portfolio game's inventory. Generate ONE clean sprite sheet of EIGHT distinct technology icons in a precise 4-column by 2-row evenly spaced grid, canvas aspect ratio 2:1, preferably 1024 x 512. Each equal square cell contains one icon centered on the exact cell center, occupying about 64% of cell width/height, with generous fully transparent padding. Reading order left to right: ROW 1: React (cyan atom with three intersecting elliptical orbits and a central dot); MongoDB (green upright pointed leaf with a stem and central vein); Figma (recognizable five-segment F logo: red/orange top pair, purple/blue middle pair, green lower left); WordPress (cream serif W within a blue circular medallion). ROW 2: PHP (lavender oval medallion with lowercase php); Node.js (green hexagonal badge with cream JS monogram); REST APIs (two cyan connector brackets facing a small gold connection hub); Embedded Systems (green integrated circuit with gold pins on four sides and dark center). Style: authentic low-resolution 16-bit pixel art, hard stepped square pixel edges, flat limited palettes, dark navy 1-pixel outline, small restrained light highlights and dark bottom/right shading. Visual complexity equivalent to a hand-drawn 48x48-pixel sprite enlarged with nearest neighbor. All eight should match in optical size and pixel density. These are flat isolated collectible icons, no inventory boxes, no scene, no perspective. Preserve familiar logo silhouettes. Transparent background including space between icons, no painted checkerboard. NO captions, no names, no extra text except intrinsic W, php and JS inside their respective logos. No grid lines, no gold frames, no glow, no gradients, no drop shadows beyond tiny pixel-art edge shading. Every icon must stay well within its cell; do not crop or overlap anything.

## Inventory captions

Wide, tall screens use the original inventory composition, with separate icon and caption rows inside each painted slot. At widths up to 700 pixels or heights up to 800 pixels, the inventory reflows and puts each caption below its PNG-framed icon. At widths up to 420 pixels it uses two columns. Captions wrap naturally and keep the complete tool name as the button's accessible name. Search, filtering, paging, and the detail view retain the existing behavior.
