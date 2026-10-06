<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  createWorld,
  stops,
  type Theme,
  type WorldController,
} from "./game/world";
import PortfolioPanel from "./components/PortfolioPanel.vue";
import TouchControls from "./components/TouchControls.vue";
const coarsePointer = window.matchMedia("(any-pointer: coarse)");
const portraitOrientation = window.matchMedia("(orientation: portrait)");
const touchInput = ref(coarsePointer.matches);
const portrait = ref(portraitOrientation.matches);
const portraitDismissed = ref(false);
const rotationPrompt = ref<HTMLDialogElement>();
const panelOpen = ref(false);
const pageInactive = ref(document.hidden);
const controlResetKey = ref(0);
const needsRotation = computed(() => touchInput.value && portrait.value && !portraitDismissed.value);
const inputPaused = computed(() => panelOpen.value || needsRotation.value || pageInactive.value);
const stage = ref<HTMLElement>();
const surface = ref<HTMLElement>();
const modal = ref<HTMLDialogElement>();
const action = ref<HTMLButtonElement>();
const nearby = ref(0);
const panel = ref<number | "map" | "help">("map");
const selectedProject = ref<string | null>(null);
const failure = ref(false);
const fullscreen = ref(false);
const fullscreenMessage = ref("");
const stageHeight = ref(window.innerHeight);
const theme = ref<Theme>(readInitialTheme());
let world: WorldController | undefined;
let observer: ResizeObserver | undefined;
let returnFocus: HTMLElement | null = null;
const current = computed(() => stops[nearby.value]);
function readInitialTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}
function applyTheme(value: Theme) {
  document.documentElement.dataset.theme = value;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", value === "dark" ? "#080f1a" : "#dcefe3");
  localStorage.setItem("theme", value);
  world?.setTheme(value);
}
function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  applyTheme(theme.value);
}
const panelTitle = computed(() =>
  panel.value === "map"
    ? "Choose your destination."
    : panel.value === "help"
      ? "How to play."
      : stops[panel.value].name,
);
function show(value: number | "map" | "help") {
  if (!modal.value?.open) {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  panel.value = value;
  selectedProject.value = null;
  panelOpen.value = true;
  syncPause();
  if (!modal.value?.open) modal.value?.showModal();
  nextTick(() => {
    modal.value?.scrollTo(0, 0);
    modal.value?.querySelector<HTMLElement>("#panel-heading")?.focus({ preventScroll: true });
  });
}
function explore() {
  if (nearby.value >= 0) show(nearby.value);
}
function close() {
  modal.value?.close();
}
function resume() {
  panelOpen.value = false;
  syncPause();
  nextTick(() => returnFocus?.focus({ preventScroll: true }));
}
function travel(index: number) {
  world?.travel(index);
  close();
  action.value?.focus({ preventScroll: true });
}
async function selectProject(slug: string | null) {
  selectedProject.value = slug;
  await nextTick();
  modal.value?.scrollTo(0, 0);
  modal.value?.querySelector<HTMLElement>("h2")?.focus();
}
function syncPause() {
  world?.pause(inputPaused.value);
}
function refreshDevice() {
  touchInput.value = coarsePointer.matches;
  portrait.value = portraitOrientation.matches;
  if (!portrait.value) portraitDismissed.value = false;
  controlResetKey.value++;
}
function dismissRotation() {
  portraitDismissed.value = true;
}
function blurGame() {
  pageInactive.value = true;
  controlResetKey.value++;
}
function focusGame() {
  pageInactive.value = document.hidden;
}
function visibilityChanged() {
  pageInactive.value = document.hidden;
  controlResetKey.value++;
}
watch(inputPaused, syncPause);
watch(needsRotation, async (showPrompt) => {
  controlResetKey.value++;
  syncPause();
  await nextTick();
  if (showPrompt && !rotationPrompt.value?.open) rotationPrompt.value?.showModal();
  else if (!showPrompt && rotationPrompt.value?.open) rotationPrompt.value.close();
});
function move(event: PointerEvent, direction: number) {
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  world?.direction(direction);
}
function stop() {
  world?.direction(0);
}
function onKey(event: KeyboardEvent) {
  if (
    !inputPaused.value &&
    event.key.toLowerCase() === "e" &&
    !event.repeat &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    event.preventDefault();
    explore();
  }
}
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    fullscreenMessage.value =
      "Fullscreen is unavailable in this preview. The game still scales to your screen.";
  }
}
const updateFullscreen = () => {
  fullscreen.value = Boolean(document.fullscreenElement);
};
onMounted(() => {
  applyTheme(theme.value);
  observer = new ResizeObserver((entries) => {
    stageHeight.value = entries[0].contentRect.height;
  });
  if (stage.value) observer.observe(stage.value);
  try {
    if (surface.value)
      world = createWorld(
        surface.value,
        (value) => {
          nearby.value = value;
        },
        theme.value,
      );
  } catch (error) {
    console.error("Game could not start", error);
    failure.value = true;
  }
  syncPause();
  if (needsRotation.value) nextTick(() => rotationPrompt.value?.showModal());
  coarsePointer.addEventListener("change", refreshDevice);
  portraitOrientation.addEventListener("change", refreshDevice);
  window.addEventListener("orientationchange", refreshDevice);
  window.addEventListener("blur", blurGame);
  window.addEventListener("focus", focusGame);
  document.addEventListener("visibilitychange", visibilityChanged);
  window.addEventListener("keydown", onKey);
  document.addEventListener("fullscreenchange", updateFullscreen);
  // Existing project URLs open their content inside the game.
  const slug = decodeURIComponent(
    window.location.pathname.split("/projects/")[1] || "",
  );
  const hash = window.location.hash.slice(1);
  const index = stops.findIndex((stop) => stop.id === hash);
  if (slug) {
    world?.travel(2);
    show(2);
    selectedProject.value = slug;
  } else if (index >= 0) {
    world?.travel(index);
    show(index);
  } else if (window.location.pathname === "/portfolio") show("map");
});
onBeforeUnmount(() => {
  coarsePointer.removeEventListener("change", refreshDevice);
  portraitOrientation.removeEventListener("change", refreshDevice);
  window.removeEventListener("orientationchange", refreshDevice);
  window.removeEventListener("blur", blurGame);
  window.removeEventListener("focus", focusGame);
  document.removeEventListener("visibilitychange", visibilityChanged);
  observer?.disconnect();
  world?.destroy();
  window.removeEventListener("keydown", onKey);
  document.removeEventListener("fullscreenchange", updateFullscreen);
});
</script>

<template>
  <main
    ref="stage"
    class="game-stage"
    :class="{ 'touch-game': touchInput, 'inspection-open': panelOpen || needsRotation }"
    :style="{ '--stage-h': `${stageHeight}px` }"
    aria-label="Aldrin’s interactive portfolio game"
  >
    <div ref="surface" class="world-surface" />
    <header class="identity">
      <p>WELCOME, EXPLORER</p>
      <h1>Aldrin’s <span>world.</span></h1>
      <p class="subtitle">Developer. Engineer. Curious human.</p>
    </header>
    <nav class="game-menu" aria-label="Game menu">
      <button @click="show('map')">
        Map <span aria-hidden="true">☷</span></button
      ><button @click="show('help')" aria-label="How to play">?</button
      ><button
        class="theme-toggle"
        @click="toggleTheme"
        :aria-label="
          theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'
        "
      >
        {{ theme === "dark" ? "☀" : "🌙" }}</button
      ><button class="fullscreen" @click="toggleFullscreen">
        {{ fullscreen ? "Exit fullscreen" : "Fullscreen" }}
      </button>
    </nav>
    <p v-if="fullscreenMessage" class="notice" role="status">
      {{ fullscreenMessage }}
    </p>
    <div v-if="failure" class="load-error">
      <h2>The world could not load.</h2>
      <p>You can still explore all portfolio content through the map.</p>
      <button @click="show('map')">Open portfolio map</button>
    </div>
    <div class="location">
      <small>{{ current ? `AREA ${current.number} / 06` : "EXPLORING" }}</small>
      <p aria-live="polite">{{ current?.name ?? "Follow your curiosity." }}</p>
    </div>
    <div v-if="!touchInput" class="movement" aria-label="Movement controls">
      <button
        aria-label="Walk left"
        @pointerdown.prevent="move($event, -1)"
        @pointerup="stop"
        @pointercancel="stop"
        @lostpointercapture="stop"
      >
        ←
      </button>
      <button
        aria-label="Walk right"
        @pointerdown.prevent="move($event, 1)"
        @pointerup="stop"
        @pointercancel="stop"
        @lostpointercapture="stop"
      >
        →
      </button>
      <button aria-label="Jump" @click="world?.jump()">↑</button>
    </div>
    <p class="instructions">
      <span class="desktop"
        >← → Move <b>·</b> ↑ / Space Jump <b>·</b> E Explore</span
      ><span class="touch">Drag the joystick to walk · Tap ↑ to jump</span>
    </p>
    <button
      ref="action"
      class="interact"
      v-if="!touchInput"
      :disabled="nearby < 0"
      @click="explore"
    >
      <kbd>E</kbd
      >{{
        nearby === 2
          ? "Explore projects"
          : nearby === 5
            ? "Say hello"
            : current
              ? "Explore"
              : "Keep exploring"
      }}
      ↗
    </button>
    <Teleport to="body">
    <TouchControls v-if="touchInput" :disabled="inputPaused" :can-explore="nearby >= 0"
      :reset-key="controlResetKey" @move="world?.direction($event)" @jump="world?.jump()" @explore="explore" />
    </Teleport>
    <dialog
      ref="modal"
      class="game-dialog"
      :class="{ 'utility-dialog': typeof panel !== 'number' }"
      aria-labelledby="panel-heading"
      @close="resume"
    >
      <div class="panel-top">
        <nav v-if="typeof panel === 'number'" class="section-nav" aria-label="Portfolio sections">
          <button v-for="(destination, index) in stops" :key="destination.id" :aria-current="panel === index ? 'page' : undefined" @click="show(index)">{{ destination.id === 'skills' ? 'Tools' : destination.label }}</button>
        </nav>
        <button class="close-panel" autofocus @click="close" aria-label="Return to game"><span aria-hidden="true">×</span><span class="close-label">Esc</span></button>
      </div>
      <div v-if="typeof panel !== 'number'" class="utility-paper png-frame">
      <template v-if="panel === 'map'"
        ><h2 id="panel-heading" tabindex="-1">{{ panelTitle }}</h2>
        <p>Travel to a location and explore what’s inside.</p>
        <div class="destinations">
          <button
            v-for="(destination, index) in stops"
            :key="destination.id"
            @click="failure ? show(index) : travel(index)"
          >
            <span>{{ destination.number }}</span
            ><strong>{{ destination.name }}</strong
            ><span>{{ destination.label }} →</span>
          </button>
        </div></template
      >
      <template v-else-if="panel === 'help'"
        ><h2 id="panel-heading" tabindex="-1">How to play.</h2>
        <dl class="help">
          <dt>← / → or A / D</dt>
          <dd>Walk left and right.</dd>
          <dt>↑ / Space / W</dt>
          <dd>Jump. Try the stepping stones along the trail.</dd>
          <dt>E / Explore</dt>
          <dd>Open a nearby landmark.</dd>
          <dt>Escape</dt>
          <dd>Close a panel and return to the same spot.</dd>
          <dt>Map</dt>
          <dd>Travel directly to any of the six areas.</dd>
        </dl>
        <p>
          On touch screens, turn your phone sideways. Drag the joystick left or right
          to walk, and tap Jump with your other thumb. Release the joystick to stop.
          Tap Explore near a landmark. You can also continue in portrait.
        </p></template
      >
      </div>
      <PortfolioPanel
        v-if="typeof panel === 'number'"
        :section="stops[panel].id"
        :project-slug="selectedProject"
        @project="selectProject"
      />
    </dialog>
    <dialog ref="rotationPrompt" class="rotation-dialog" aria-labelledby="rotation-heading"
      aria-describedby="rotation-description" @cancel.prevent="dismissRotation">
      <div class="rotation-art" aria-hidden="true">
        <svg viewBox="0 0 120 100" focusable="false"><path d="M31 31V15h58v35M89 69v16H31V65" fill="none" stroke="currentColor" stroke-width="4"/><path d="m81 42 8 8 8-8M23 73l8-8 8 8" fill="none" stroke="currentColor" stroke-width="4"/><rect x="43" y="24" width="34" height="52" rx="4" fill="#19323b" stroke="currentColor" stroke-width="4"/><path d="M56 68h8" stroke="currentColor" stroke-width="3"/></svg>
      </div>
      <h2 id="rotation-heading">A little more room<br />for adventure.</h2>
      <p id="rotation-description">Turn your phone sideways to play.</p>
      <p class="rotation-hint">Joystick on the left.<br />Jump and Explore on the right.</p>
      <button type="button" class="portrait-continue" @click="dismissRotation">Continue in portrait</button>
    </dialog>
  </main>
</template>
