<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
const props = defineProps<{ disabled: boolean; canExplore: boolean; resetKey: number }>();
const emit = defineEmits<{ move: [value: number]; jump: []; explore: [] }>();
const pad = ref<HTMLButtonElement>();
const offset = ref({ x: 0, y: 0 });
const direction = ref(0);
const activePointer = ref<number | null>(null);
const valueText = computed(() => direction.value === 0 ? "Stopped" : direction.value < 0 ? "Walk left" : "Walk right");
function reset() {
  const id = activePointer.value;
  activePointer.value = null;
  offset.value = { x: 0, y: 0 };
  direction.value = 0;
  emit("move", 0);
  if (id !== null && pad.value?.hasPointerCapture(id)) pad.value.releasePointerCapture(id);
}
function update(event: PointerEvent) {
  if (props.disabled || event.pointerId !== activePointer.value || !pad.value) return;
  const rect = pad.value.getBoundingClientRect();
  const radius = rect.width * .28;
  const dx = event.clientX - rect.left - rect.width / 2;
  const dy = event.clientY - rect.top - rect.height / 2;
  const distance = Math.hypot(dx, dy);
  const factor = distance > radius ? radius / distance : 1;
  offset.value = { x: dx * factor, y: dy * factor };
  const horizontal = offset.value.x / radius;
  // A quiet center avoids accidental walking; the rest of the range is analog.
  direction.value = Math.abs(horizontal) < .18 ? 0 : Math.sign(horizontal) * (Math.abs(horizontal) - .18) / .82;
  emit("move", direction.value);
}
function start(event: PointerEvent) {
  if (props.disabled || activePointer.value !== null || event.button !== 0) return;
  activePointer.value = event.pointerId;
  pad.value?.setPointerCapture(event.pointerId);
  update(event);
}
function end(event: PointerEvent) {
  if (event.pointerId === activePointer.value) reset();
}
function keyMove(event: KeyboardEvent) {
  if (props.disabled || !["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  direction.value = event.key === "Home" ? 0 : event.key === "ArrowLeft" ? -1 : 1;
  offset.value = { x: direction.value * 28, y: 0 };
  emit("move", direction.value);
}
function keyStop(event: KeyboardEvent) {
  if (["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) {
    event.preventDefault();
    event.stopPropagation();
    reset();
  }
}
function jumpPointer(event: PointerEvent) {
  if (!props.disabled && event.button === 0) emit("jump");
}
watch(() => [props.disabled, props.resetKey], reset);
onBeforeUnmount(reset);
</script>

<template>
  <div class="touch-controls" :class="{ 'controls-disabled': disabled }" aria-label="Touch game controls">
    <div class="joystick-wrap">
      <button ref="pad" class="joystick" type="button" role="slider"
        aria-label="Movement joystick" aria-orientation="horizontal"
        :aria-valuemin="-100" :aria-valuemax="100" :aria-valuenow="Math.round(direction * 100)"
        :aria-valuetext="valueText" aria-describedby="joystick-help" :disabled="disabled"
        :class="{ 'is-dragging': activePointer !== null || direction !== 0 }"
        @pointerdown.prevent="start" @pointermove.prevent="update" @pointerup="end"
        @pointercancel="end" @lostpointercapture="end" @contextmenu.prevent
        @keydown="keyMove" @keyup="keyStop" @blur="reset">
        <span class="joystick-axis" aria-hidden="true">← <span>→</span></span>
        <span class="joystick-thumb" aria-hidden="true" :style="{ transform: `translate(${offset.x}px, ${offset.y}px)` }">✦</span>
      </button>
      <span class="touch-control-label" aria-hidden="true">Move</span>
      <span id="joystick-help" class="sr-only">Drag left or right to walk. Release to stop. You can jump with your other thumb. Keyboard: hold left or right arrow.</span>
    </div>
    <div class="touch-actions">
      <button class="touch-jump" type="button" :disabled="disabled" @pointerdown.prevent="jumpPointer"
        @click="($event.detail === 0 && !disabled) && emit('jump')" aria-label="Jump">
        <span aria-hidden="true">↑</span><span>Jump</span>
      </button>
      <button class="touch-explore" type="button" :disabled="disabled || !canExplore" @click="emit('explore')" aria-label="Explore nearby area">
        <span aria-hidden="true">✦</span><span>{{ canExplore ? 'Explore' : 'Walk closer' }}</span>
      </button>
    </div>
  </div>
</template>
