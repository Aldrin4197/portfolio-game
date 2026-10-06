// The in-game character is a real pixel-art sprite sheet (not procedurally
// drawn rectangles) so the art can be opened/edited in any image editor and
// reused anywhere an <img>/texture is needed. The asset lives in
// public/assets/aldrin-sprites.png, packed as a uniform 4-column x 7-row
// grid of 64x64 frames — see public/assets/aldrin-sprites.json for the
// source packing metadata (frame rects, per-row animation names/fps, and
// the ground-contact anchor point used below).
export type SpriteKey =
  | "idle_front"
  | "idle_left"
  | "idle_right"
  | "walk_right"
  | "walk_left"
  | "jump_left"
  | "jump_right";

// Public-folder assets are served from the site root, unprocessed by Vite's
// module graph, so this is referenced as a plain URL rather than imported.
export const CHARACTER_SPRITE_URL = `${import.meta.env.BASE_URL}assets/aldrin-sprites.png`;
export const CHARACTER_SHEET_COLS = 4;
export const CHARACTER_SHEET_ROWS = 7;
export const CHARACTER_FRAME_WIDTH = 64;
export const CHARACTER_FRAME_HEIGHT = 64;
// Ground-contact pivot within each frame (aldrin-sprites.json: meta.anchor).
export const CHARACTER_ANCHOR_X = 32;
export const CHARACTER_ANCHOR_Y = 60;

const spriteRows: Record<SpriteKey, number> = {
  idle_front: 0,
  idle_left: 1,
  idle_right: 2,
  walk_right: 3,
  walk_left: 4,
  jump_left: 5,
  jump_right: 6,
};

// Wraps any real number into [0, 1), handling negatives correctly.
const wrap01 = (value: number) => ((value % 1) + 1) % 1;

/**
 * Picks the sprite-sheet frame (row * cols + col) for a given sprite.
 * Walking cycles through its 4 frames based on distance travelled
 * (`strideSeed`, typically world x) so legs only animate while moving.
 * Idle states (idle_front/idle_left/idle_right) cycle slowly over time —
 * matching the sheet's authored 3fps idle loop. Jumping isn't a loop (per
 * the sheet's `loop: false` jump animations); instead it steps through
 * takeoff → rise → fall → land based on actual jump velocity.
 */
export function characterFrameIndex(
  sprite: SpriteKey,
  time: number,
  strideSeed: number,
  reduced = false,
  jumpVelocity = 0,
): number {
  const row = spriteRows[sprite];
  let col = 0;
  if (sprite.startsWith("jump")) {
    col = reduced
      ? 1
      : jumpVelocity < -120
        ? 0
        : jumpVelocity < 0
          ? 1
          : jumpVelocity < 250
            ? 2
            : 3;
  } else if (!reduced) {
    if (sprite.startsWith("walk")) {
      col = Math.floor(wrap01(strideSeed / 69) * CHARACTER_SHEET_COLS);
    } else {
      col = Math.floor(wrap01(time / 1.3) * CHARACTER_SHEET_COLS);
    }
  }
  return row * CHARACTER_SHEET_COLS + col;
}

