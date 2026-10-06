<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ name?: string; mark?: string }>();
const frames: Record<string, [number, number]> = {
  javascript: [0, 0], vue: [1, 0], laravel: [2, 0], flutter: [3, 0],
  git: [0, 1], sql: [1, 1], react: [2, 1], mongodb: [3, 1],
  figma: [0, 2], wordpress: [1, 2], php: [2, 2], nodejs: [3, 2],
  api: [0, 3], embedded: [1, 3],
};
const frame = computed(() => props.name ? frames[props.name] : undefined);
</script>
<template>
  <span v-if="frame" class="png-icon" aria-hidden="true" :data-sprite="name" :style="{ backgroundPosition: `${frame[0] * 100 / 3}% ${frame[1] * 100 / 3}%` }" />
  <span v-else class="tool-monogram" aria-hidden="true">{{ mark || '?' }}</span>
</template>
