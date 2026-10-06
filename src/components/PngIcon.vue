<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ name?: string; mark?: string }>();
const frames: Record<string, [number, number]> = {
  javascript: [0, 0], vue: [1, 0], laravel: [2, 0],
  flutter: [0, 1], git: [1, 1], sql: [2, 1],
};
const frame = computed(() => props.name ? frames[props.name] : undefined);
</script>
<template>
  <span v-if="frame" class="png-icon" aria-hidden="true" :style="{ backgroundPosition: `${frame[0] * 50}% ${frame[1] * 100}%` }" />
  <span v-else class="tool-monogram" aria-hidden="true">{{ mark || '?' }}</span>
</template>
