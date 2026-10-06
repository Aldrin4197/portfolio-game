import kaplay from "kaplay";
import type { SoundEffect } from "./audio";
import {
  CHARACTER_ANCHOR_X,
  CHARACTER_ANCHOR_Y,
  CHARACTER_FRAME_HEIGHT,
  CHARACTER_FRAME_WIDTH,
  CHARACTER_SHEET_COLS,
  CHARACTER_SHEET_ROWS,
  CHARACTER_SPRITE_URL,
  characterFrameIndex,
  type SpriteKey,
} from "./character";
const WORLD_HEIGHT = 420;
export type Theme = "light" | "dark";
export const stops = [
  {
    id: "about",
    name: "Developer’s cabin",
    label: "About",
    x: 180,
    number: "01",
  },
  { id: "skills", name: "The workshop", label: "Skills", x: 850, number: "02" },
  {
    id: "projects",
    name: "Project arcade",
    label: "Projects",
    x: 1500,
    number: "03",
  },
  {
    id: "experience",
    name: "Journey trail",
    label: "Experience",
    x: 2150,
    number: "04",
  },
  {
    id: "achievements",
    name: "Achievement hall",
    label: "Achievements",
    x: 2800,
    number: "05",
  },
  {
    id: "contact",
    name: "Contact portal",
    label: "Contact",
    x: 3450,
    number: "06",
  },
];

const platforms = [
  { x: 475, y: 304, width: 72 },
  { x: 580, y: 273, width: 72 },
  { x: 1810, y: 298, width: 95 },
  { x: 2470, y: 304, width: 80 },
];

// Day and night palettes drive every drawn shape so flipping the theme
// re-skins the whole scene instead of just the UI chrome around it.
interface Palette {
  sky: string;
  starBright: string;
  starDim: string;
  moon: string;
  sun: string;
  sunGlow: string;
  cloud: string;
  cloudShade: string;
  mountain: string;
  mountainShade: string;
  pineFar: string;
  pineNear: string;
  pineHighlight: string;
  trunk: string;
  groundBack: string;
  grassLine: string;
  soilMid: string;
  soilDeep: string;
  pathFleck: string;
  flowerA: string;
  flowerB: string;
  pebble: string;
  platformTop: string;
  platformSide: string;
  cabinFrame: string;
  cabinWall: string;
  roofBand: string;
  trim: string;
  windowGlass: string;
  windowGlow: string;
  doorColor: string;
  doorknob: string;
  smoke: string;
  arcadeBody: string;
  arcadeTrim: string;
  screenBg: string;
  screenGlow: string;
  marqueeOn: string;
  marqueeOff: string;
  workshopWood: string;
  workshopRoof: string;
  workshopLeg: string;
  gearColor: string;
  signPost: string;
  signPlank: string;
  signPlankEdge: string;
  signArrow: string;
  hallBase: string;
  hallGoldDark: string;
  hallGoldLight: string;
  hallMedal: string;
  portalFrame: string;
  portalFrameLight: string;
  portalRingOuter: string;
  portalRingMid: string;
  portalRingInner: string;
  portalCore: string;
  portalSpark: string;
  labelBg: string;
  labelText: string;
  markerGlow: string;
  markerPupil: string;
  ambient: string;
  ambientOpacity: number;
}

const palettes: Record<Theme, Palette> = {
  dark: {
    sky: "#0e1b2e",
    starBright: "#e2cd8d",
    starDim: "#7e9ba3",
    moon: "#ead8a2",
    sun: "#ffd873",
    sunGlow: "#fff3c4",
    cloud: "#28333b",
    cloudShade: "#1d262c",
    mountain: "#243e52",
    mountainShade: "#1c3140",
    pineFar: "#234950",
    pineNear: "#2d5a51",
    pineHighlight: "#3c7466",
    trunk: "#28333b",
    groundBack: "#1b3331",
    grassLine: "#78916b",
    soilMid: "#4a6652",
    soilDeep: "#283c39",
    pathFleck: "#354d45",
    flowerA: "#b7b877",
    flowerB: "#d2a28b",
    pebble: "#59706a",
    platformTop: "#93aa89",
    platformSide: "#536d61",
    cabinFrame: "#443e44",
    cabinWall: "#7f6657",
    roofBand: "#394955",
    trim: "#715b50",
    windowGlass: "#e7c789",
    windowGlow: "#ffdf9b",
    doorColor: "#34313a",
    doorknob: "#e7c789",
    smoke: "#9fb3bb",
    arcadeBody: "#343447",
    arcadeTrim: "#748b88",
    screenBg: "#132d37",
    screenGlow: "#89cfc1",
    marqueeOn: "#ffb199",
    marqueeOff: "#4d4d63",
    workshopWood: "#8a7055",
    workshopRoof: "#566b72",
    workshopLeg: "#594d49",
    gearColor: "#9fb6b3",
    signPost: "#836751",
    signPlank: "#b39b72",
    signPlankEdge: "#665746",
    signArrow: "#e3cfaa",
    hallBase: "#73837f",
    hallGoldDark: "#d2ae65",
    hallGoldLight: "#edcf84",
    hallMedal: "#c4a567",
    portalFrame: "#526a77",
    portalFrameLight: "#708e99",
    portalRingOuter: "#143b49",
    portalRingMid: "#377c83",
    portalRingInner: "#87cdb5",
    portalCore: "#c1e4bd",
    portalSpark: "#eafff6",
    labelBg: "#182a32",
    labelText: "#e5dac3",
    markerGlow: "#e8cc90",
    markerPupil: "#182a32",
    ambient: "#0a1526",
    ambientOpacity: 0.12,
  },
  light: {
    sky: "#7ec8ea",
    starBright: "#ffffff",
    starDim: "#ffffff",
    moon: "#ead8a2",
    sun: "#ffd873",
    sunGlow: "#fff6d2",
    cloud: "#ffffff",
    cloudShade: "#dfeef5",
    mountain: "#8db6cf",
    mountainShade: "#729dba",
    pineFar: "#4f8c6b",
    pineNear: "#5fae72",
    pineHighlight: "#7fcb86",
    trunk: "#4a3b2c",
    groundBack: "#bfe6ad",
    grassLine: "#8fd97a",
    soilMid: "#c9a36b",
    soilDeep: "#8a6b4f",
    pathFleck: "#6b8f52",
    flowerA: "#ffd76b",
    flowerB: "#ff9eb3",
    pebble: "#a9896a",
    platformTop: "#bfe29e",
    platformSide: "#7fa468",
    cabinFrame: "#5a5257",
    cabinWall: "#c9a06f",
    roofBand: "#5c6e81",
    trim: "#8a6b4f",
    windowGlass: "#bfe9ff",
    windowGlow: "#ffffff",
    doorColor: "#4a4650",
    doorknob: "#f0d9a0",
    smoke: "#ffffff",
    arcadeBody: "#4a4a63",
    arcadeTrim: "#9fb6b3",
    screenBg: "#dff3f0",
    screenGlow: "#ffffff",
    marqueeOn: "#ffd27a",
    marqueeOff: "#cbd5d3",
    workshopWood: "#ad8d68",
    workshopRoof: "#7e97a0",
    workshopLeg: "#7a6456",
    gearColor: "#5c6e81",
    signPost: "#9c7f62",
    signPlank: "#d4bb8d",
    signPlankEdge: "#8a765d",
    signArrow: "#4a3b2c",
    hallBase: "#aab8b4",
    hallGoldDark: "#e8c377",
    hallGoldLight: "#fbe4a0",
    hallMedal: "#f0cf85",
    portalFrame: "#7fa3ad",
    portalFrameLight: "#a8c7cd",
    portalRingOuter: "#bfe7df",
    portalRingMid: "#8fd6c4",
    portalRingInner: "#c9f0e0",
    portalCore: "#eafff6",
    portalSpark: "#ffffff",
    labelBg: "#f4ead0",
    labelText: "#2a4a3d",
    markerGlow: "#ffce54",
    markerPupil: "#2a4a3d",
    ambient: "#fff3d0",
    ambientOpacity: 0.08,
  },
};

export function createWorld(
  host: HTMLElement,
  onNearby: (index: number) => void,
  initialTheme: Theme = "dark",
  onSound: (effect: SoundEffect) => void = () => {},
) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute(
    "aria-label",
    "Aldrin’s pixel game world. Use left and right arrows to walk, Space or up arrow to jump, and E to explore.",
  );
  canvas.className = "world-canvas";
  host.append(canvas);
  const k = kaplay({
    canvas,
    // Let KAPLAY resize its drawing buffer with the host. The camera reveals
    // more world on wide screens instead of stretching sprites or letterboxing.
    global: false,
    background: palettes[initialTheme].sky,
    crisp: true,
    debug: false,
    pixelDensity: 1,
    touchToMouse: false,
  });
  canvas.tabIndex = -1;
  k.loadSprite("hero", CHARACTER_SPRITE_URL, {
    sliceX: CHARACTER_SHEET_COLS,
    sliceY: CHARACTER_SHEET_ROWS,
  });
  let theme: Theme = initialTheme;
  let playerX = 180,
    jumpY = 0,
    jumpVelocity = 0,
    facing: 1 | -1 = 1,
    nearby = 0;
  let walking = false,
    paused = false,
    grounded = true,
    pointerDirection = 0;
  const keys = new Set<string>();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motion.matches;
  const changeMotion = () => {
    reduced = motion.matches;
  };
  motion.addEventListener("change", changeMotion);
  const jump = () => {
    if (!paused && grounded) {
      jumpVelocity = -285;
      grounded = false;
      onSound("jump");
    }
  };
  const clear = () => {
    keys.clear();
    pointerDirection = 0;
    walking = false;
  };
  const publish = () => {
    let next = -1;
    stops.forEach((stop, index) => {
      if (Math.abs(playerX - stop.x) < 145) next = index;
    });
    if (next !== nearby) {
      nearby = next;
      onNearby(next);
    }
    canvas.dataset.playerX = String(playerX);
    canvas.dataset.jumpY = String(jumpY);
    canvas.dataset.grounded = String(grounded);
    canvas.dataset.walking = String(walking);
  };
  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    opacity = 1,
  ) =>
    k.drawRect({
      pos: k.vec2(Math.round(x), Math.round(y)),
      width: w,
      height: h,
      color: k.Color.fromHex(color),
      opacity,
    });
  const glyphs: Record<string, string[]> = {
    A: ["010", "101", "111", "101", "101"],
    B: ["110", "101", "110", "101", "110"],
    C: ["011", "100", "100", "100", "011"],
    E: ["111", "100", "110", "100", "111"],
    H: ["101", "101", "111", "101", "101"],
    I: ["111", "010", "010", "010", "111"],
    J: ["001", "001", "001", "101", "010"],
    K: ["101", "101", "110", "101", "101"],
    L: ["100", "100", "100", "100", "111"],
    M: ["101", "111", "111", "101", "101"],
    N: ["101", "111", "111", "111", "101"],
    O: ["010", "101", "101", "101", "010"],
    P: ["110", "101", "110", "100", "100"],
    R: ["110", "101", "110", "101", "101"],
    S: ["011", "100", "010", "001", "110"],
    T: ["111", "010", "010", "010", "010"],
    U: ["101", "101", "101", "101", "111"],
    V: ["101", "101", "101", "101", "010"],
    X: ["101", "101", "010", "101", "101"],
  };
  const pixelLabel = (text: string, x: number, y: number, color: string) => {
    const size = 1.5;
    const left = x - ((text.length * 4 - 1) * size) / 2;
    [...text].forEach((letter, i) =>
      glyphs[letter]?.forEach((row, dy) =>
        [...row].forEach((pixel, dx) => {
          if (pixel === "1")
            box(left + (i * 4 + dx) * size, y + dy * size, size, size, color);
        }),
      ),
    );
  };
  // Two-tone pine with a lit canopy edge for a touch more depth.
  const pine = (
    x: number,
    y: number,
    size: number,
    color: string,
    highlight: string,
    trunkColor: string,
  ) => {
    box(x - 3 * size, y, 6 * size, 42 * size, trunkColor);
    for (let t = 0; t < 5; t++) {
      const rowY = y - 36 * size + t * 13 * size;
      const rowW = 16 + t * 8;
      box(x - (8 + t * 4) * size, rowY, rowW * size, 17 * size, color);
      box(
        x - (8 + t * 4) * size,
        rowY,
        rowW * size * 0.32,
        6 * size,
        highlight,
        0.55,
      );
    }
  };
  const cloud = (x: number, y: number, scale: number, pal: Palette) => {
    box(x, y, 60 * scale, 16 * scale, pal.cloud);
    box(x + 12 * scale, y - 10 * scale, 36 * scale, 14 * scale, pal.cloud);
    box(x + 6 * scale, y + 14 * scale, 48 * scale, 7 * scale, pal.cloudShade);
  };

  k.onUpdate(() => {
    if (paused) {
      walking = false;
      publish();
      return;
    }
    const dt = Math.min(k.dt(), 1 / 30);
    const direction =
      pointerDirection ||
      Number(keys.has("ArrowRight") || keys.has("d")) -
        Number(keys.has("ArrowLeft") || keys.has("a"));
    const before = playerX;
    playerX = Math.max(100, Math.min(3530, playerX + direction * 195 * dt));
    walking = Math.abs(before - playerX) > 0.001;
    if (walking) facing = direction > 0 ? 1 : -1;
    const wasGrounded = grounded;
    const lastFeet = 332 + jumpY;
    jumpVelocity += 780 * dt;
    let nextFeet = lastFeet + jumpVelocity * dt;
    grounded = false;
    if (jumpVelocity >= 0) {
      const surfaces = platforms
        .filter((p) => playerX + 9 > p.x && playerX - 9 < p.x + p.width)
        .map((p) => p.y)
        .concat(332)
        .sort((a, b) => a - b);
      for (const y of surfaces)
        if (lastFeet <= y + 0.1 && nextFeet >= y) {
          nextFeet = y;
          jumpVelocity = 0;
          grounded = true;
          break;
        }
    }
    jumpY = Math.min(0, nextFeet - 332);
    if (grounded && !wasGrounded) onSound("land");
    publish();
  });
  k.onDraw(() => {
    const pal = palettes[theme];
    const night = theme === "dark";
    const t = k.time();
    // Portrait keeps a useful horizontal field of view; extra height becomes
    // sky above the scene. The ground stays at the same relative screen height.
    const scale = Math.min(k.height() / WORLD_HEIGHT, k.width() / 480);
    const verticalOffset = k.height() * (332 / WORLD_HEIGHT) - 332 * scale;
    const w = k.width() / scale;
    k.pushTransform();
    k.pushTranslate(0, verticalOffset);
    k.pushScale(scale);
    const camera = playerX - w * 0.38;
    const depth = reduced ? 0 : camera;
    const pulse = reduced ? 0.5 : k.wave(0, 1, t * 1.6);
    if (night) {
      // Twinkling stars and a crescent moon light the sky.
      for (let i = 0; i < 55; i++) {
        const sx =
          (((i * 137 - depth * 0.08) % (w + 120)) + w + 120) % (w + 120);
        const twinkle = reduced
          ? 1
          : k.wave(0.45, 1, t * 1.3 + i * 0.6);
        box(
          sx,
          18 + ((i * 47) % 138),
          i % 4 === 0 ? 3 : 2,
          2,
          i % 3 ? pal.starDim : pal.starBright,
          twinkle,
        );
      }
      box(w - 68, 82, 42, 42, pal.sunGlow, 0.18);
      box(w - 65, 85, 36, 36, pal.moon);
      box(w - 53, 80, 31, 29, pal.sky);
    } else {
      // A warm sun and drifting clouds stand in for the moon and stars.
      box(w - 73, 77, 58, 58, pal.sunGlow, 0.3);
      box(w - 65, 85, 36, 36, pal.sun);
      for (let r = 0; r < 4; r++) {
        const ray = 8 + r * 7;
        box(w - 48 - r * 12, 103 - ray, 3, ray, pal.sunGlow, 0.5);
        box(w - 29 + r * 10, 103 - ray, 3, ray, pal.sunGlow, 0.5);
      }
      for (let i = -1; i < Math.ceil(w / 260) + 2; i++) {
        const x =
          ((i * 260 - depth * 0.1) % (w + 260)) + (i < 0 ? -260 : 0);
        cloud(x, 40 + (i % 2) * 22, 1, pal);
      }
    }
    for (let i = -2; i < Math.ceil(w / 240) + 3; i++) {
      const x = i * 240 - ((depth * 0.15) % 240);
      for (let row = 0; row < 7; row++)
        box(
          x - row * 20,
          145 + row * 23,
          45 + row * 40,
          200,
          row % 2 ? pal.mountainShade : pal.mountain,
        );
    }
    for (let i = -2; i < 42; i++)
      pine(
        i * 115 - ((depth * 0.35) % 115),
        220 + (i % 3) * 10,
        1.4,
        pal.pineFar,
        pal.pineHighlight,
        pal.trunk,
      );
    box(0, 300, w, 120, pal.groundBack);
    box(0, 331, w, 9, pal.grassLine);
    box(0, 340, w, 18, pal.soilMid);
    box(0, 358, w, Math.max(62, (k.height() - verticalOffset) / scale - 358), pal.soilDeep);
    for (let i = -1; i < Math.ceil(w / 32) + 2; i++) {
      const x = i * 32 - (camera % 32);
      box(
        x,
        369 + (i % 3) * 8,
        14,
        4,
        i % 5 === 0 ? pal.pebble : pal.pathFleck,
      );
    }
    for (let i = 0; i < 42; i++) {
      const x = i * 97 - camera;
      if (x < -70 || x > w + 70) continue;
      if (stops.every((stop) => Math.abs(i * 97 - stop.x) > 145))
        pine(x, 276, 1.1, pal.pineNear, pal.pineHighlight, pal.trunk);
      box(x + 24, 319, 4, 12, pal.grassLine);
      box(x + 20, 316, 12, 4, i % 3 ? pal.flowerA : pal.flowerB);
    }
    for (const platform of platforms) {
      box(platform.x - camera, platform.y, platform.width, 7, pal.platformTop);
      box(
        platform.x - camera + 3,
        platform.y + 7,
        platform.width - 6,
        13,
        pal.platformSide,
      );
    }
    // Developer cabin.
    const cabin = 180 - camera;
    box(cabin - 103, 217, 200, 112, pal.cabinFrame);
    box(cabin - 93, 226, 180, 102, pal.cabinWall);
    for (let r = 0; r < 5; r++)
      box(cabin - 117 + r * 17, 198 - r * 15, 230 - r * 34, 17, pal.roofBand);
    // Chimney with drifting smoke.
    box(cabin + 60, 160, 16, 40, pal.roofBand);
    for (let p = 0; p < 3; p++) {
      const puffT = (t * 18 + p * 9) % 30;
      box(
        cabin + 64 + Math.sin(t * 1.4 + p) * 4,
        152 - puffT * 2.1,
        9 + p * 2,
        9 + p * 2,
        pal.smoke,
        Math.max(0, 0.5 - puffT / 60),
      );
    }
    for (let row = 0; row < 6; row++)
      box(cabin - 92, 233 + row * 15, 180, 2, pal.trim);
    box(cabin - 63, 247, 48, 41, pal.windowGlass);
    if (night) box(cabin - 68, 242, 58, 51, pal.windowGlow, 0.2);
    else box(cabin - 60, 250, 14, 35, pal.sunGlow, 0.35);
    box(cabin - 41, 247, 5, 41, pal.cabinWall);
    box(cabin - 63, 265, 48, 5, pal.cabinWall);
    box(cabin + 12, 269, 39, 60, pal.doorColor);
    box(cabin + 40, 300, 4, 4, pal.doorknob);
    // Flower box under the window.
    box(cabin - 66, 289, 54, 9, pal.trim);
    for (let f = 0; f < 5; f++)
      box(cabin - 62 + f * 11, 282, 6, 8, f % 2 ? pal.flowerA : pal.flowerB);
    // Arcade machines.
    const arcade = 1500 - camera;
    for (let i = -1; i < 2; i++) {
      const x = arcade + i * 76;
      box(x - 27, 241, 54, 88, pal.arcadeBody);
      box(x - 31, 232, 62, 17, pal.arcadeTrim);
      for (let m = 0; m < 5; m++) {
        const lit = night
          ? k.wave(0.3, 1, t * 3 + m + i) > 0.5
          : true;
        box(
          x - 24 + m * 11,
          236,
          5,
          5,
          lit ? pal.marqueeOn : pal.marqueeOff,
        );
      }
      box(x - 20, 252, 40, 36, pal.screenBg);
      const glow = night ? k.wave(0.55, 1, t * 2.2 + i) : 0.55;
      box(x - 20, 252, 40, 36, pal.screenGlow, night ? glow * 0.35 : 0.2);
      box(x - 13, 260, 26, 4, pal.screenGlow);
      box(x - 13, 269, 17, 4, pal.screenGlow);
      box(x - 23, 290, 46, 12, pal.arcadeTrim);
      box(x - 12, 290, 4, 6, pal.doorknob);
      box(x + 9, 294, 5, 4, pal.flowerB);
    }
    // Workshop, journey signposts, and achievement pavilion.
    const workshop = 850 - camera;
    box(workshop - 78, 305, 156, 12, pal.workshopWood);
    box(workshop - 68, 317, 10, 14, pal.workshopLeg);
    box(workshop + 58, 317, 10, 14, pal.workshopLeg);
    box(workshop - 52, 252, 104, 56, pal.workshopRoof);
    box(workshop - 44, 260, 88, 37, pal.screenBg);
    if (night) box(workshop - 48, 256, 96, 45, pal.windowGlow, 0.15);
    for (let r = 0; r < 4; r++)
      box(workshop - 34, 267 + r * 7, 30 + (r % 2) * 21, 3, pal.screenGlow);
    // Gear decoration beside the workshop window.
    const gx = workshop + 70;
    box(gx - 10, 270, 20, 20, pal.gearColor);
    box(gx - 14, 276, 28, 8, pal.gearColor);
    box(gx - 4, 278, 8, 8, pal.workshopRoof);
    const trail = 2150 - camera;
    box(trail - 5, 222, 10, 109, pal.signPost);
    for (let r = 0; r < 3; r++) {
      box(trail - 60 + r * 9, 232 + r * 27, 110, 18, pal.signPlank);
      box(trail - 42 + r * 9, 238 + r * 27, 58, 3, pal.signPlankEdge);
      // Arrow tip pointing along the trail.
      box(trail + 50 + r * 9, 234 + r * 27, 6, 14, pal.signArrow);
      box(trail + 56 + r * 9, 237 + r * 27, 5, 8, pal.signArrow);
      box(trail + 60 + r * 9, 240 + r * 27, 4, 2, pal.signArrow);
    }
    const hall = 2800 - camera;
    box(hall - 95, 320, 190, 11, pal.hallBase);
    box(hall - 90, 233, 180, 12, pal.hallBase);
    // Pediment roof capping the hall.
    for (let r = 0; r < 4; r++)
      box(
        hall - 60 + r * 15,
        233 - (4 - r) * 8,
        120 - r * 30,
        9,
        pal.hallGoldDark,
      );
    box(hall - 7, 196, 14, 14, pal.hallMedal);
    box(hall - 81, 245, 15, 75, pal.hallBase);
    box(hall + 66, 245, 15, 75, pal.hallBase);
    box(hall - 32, 260, 64, 13, pal.hallGoldDark);
    box(hall - 25, 273, 50, 18, pal.hallGoldLight);
    box(hall - 8, 291, 16, 16, pal.hallMedal);
    box(hall - 22, 307, 44, 8, pal.hallGoldDark);
    // Portal with a pulsing energy field.
    const portal = 3450 - camera;
    box(portal - 49, 228, 98, 102, pal.portalFrame);
    box(portal - 37, 217, 74, 12, pal.portalFrameLight);
    box(portal - 30, 237, 60, 93, pal.portalRingOuter);
    box(portal - 24, 244, 48, 80, pal.portalRingMid);
    box(
      portal - 17 - pulse,
      251 - pulse,
      34 + pulse * 2,
      73 + pulse * 2,
      pal.portalRingInner,
      0.9,
    );
    box(portal - 10, 264, 20, 60, pal.portalCore);
    for (let s = 0; s < 4; s++) {
      const angle = t * 1.8 + (s * Math.PI) / 2;
      box(
        portal + Math.cos(angle) * 22 - 2,
        283 + Math.sin(angle) * 36 - 2,
        4,
        4,
        pal.portalSpark,
        night ? 0.85 : 0.6,
      );
    }
    for (let i = 0; i < stops.length; i++) {
      const x = stops[i].x - camera;
      box(x - 45, 175, 90, 22, pal.labelBg);
      pixelLabel(stops[i].label.toUpperCase(), x, 182, pal.labelText);
      if (nearby === i) {
        box(x - 9, 205, 18, 18, pal.markerGlow);
        box(x - 1.5, 208, 3, 7, pal.markerPupil);
        box(x - 1.5, 217, 3, 2, pal.markerPupil);
      }
    }
    // Character: a real pixel-art sprite sheet (public/assets/aldrin-sprites.png)
    // with distinct walk/idle/jump frames per direction. Pressing E (or
    // opening any panel) turns the character to face the camera —
    // idle_front — while it's paused.
    const px = playerX - camera;
    const spriteKey: SpriteKey = paused
      ? "idle_front"
      : !grounded
        ? facing === 1
          ? "jump_right"
          : "jump_left"
        : walking
          ? facing === 1
            ? "walk_right"
            : "walk_left"
          : facing === 1
            ? "idle_right"
            : "idle_left";
    box(px - 17, 329, 34, 4, "#182a2b");
    k.pushTransform();
    k.pushTranslate(0, jumpY);
    k.drawSprite({
      sprite: "hero",
      frame: characterFrameIndex(spriteKey, t, playerX, reduced, jumpVelocity),
      pos: k.vec2(px - CHARACTER_ANCHOR_X, 332 - CHARACTER_ANCHOR_Y),
      width: CHARACTER_FRAME_WIDTH,
      height: CHARACTER_FRAME_HEIGHT,
    });
    k.popTransform();
    // Ambient color wash ties the whole scene to the current time of day.
    box(0, -verticalOffset / scale, w, k.height() / scale, pal.ambient, pal.ambientOpacity);
    k.popTransform();
  });


  publish();
  const keyDown = (event: KeyboardEvent) => {
    if (
      paused ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    )
      return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(key)) {
      event.preventDefault();
      keys.add(key);
    }
    if (
      (event.code === "Space" || key === "ArrowUp" || key === "w") &&
      !(event.target instanceof HTMLButtonElement && event.code === "Space")
    ) {
      event.preventDefault();
      if (!event.repeat) jump();
    }
  };
  const keyUp = (event: KeyboardEvent) =>
    keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("blur", clear);
  return {
    jump,
    direction(value: number) {
      pointerDirection = paused || !Number.isFinite(value) ? 0 : Math.max(-1, Math.min(1, value));
    },
    pause(value: boolean) {
      paused = value;
      clear();
    },
    travel(index: number) {
      const stop = stops[index];
      if (!stop) return;
      clear();
      playerX = stop.x;
      jumpY = 0;
      jumpVelocity = 0;
      grounded = true;
      publish();
    },
    setTheme(value: Theme) {
      theme = value;
      k.setBackground(k.Color.fromHex(palettes[value].sky));
    },
    destroy() {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", clear);
      motion.removeEventListener("change", changeMotion);
      k.quit();
      canvas.remove();
    },
  };
}
export type WorldController = ReturnType<typeof createWorld>;
