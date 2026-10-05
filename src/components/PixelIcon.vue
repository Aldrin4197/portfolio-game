<script setup lang="ts">
// Renders a small bitmap as crisp CSS-grid pixels — a tiny, fully reusable
// "pixel art" icon renderer. Pass a square grid of characters (`rows`) plus
// a character→color lookup (`colors`); '.' is always transparent. Used for
// the inventory badges in the Skills/"Tools of the trade" section, but any
// scene can reuse it for other pixel icons.
withDefaults(
  defineProps<{
    rows: string[];
    colors: Record<string, string>;
    /** Size of one pixel cell, in px. */
    size?: number;
    label?: string;
  }>(),
  { size: 3, label: "" },
);
</script>

<template>
  <div
    class="pixel-icon"
    role="img"
    :aria-label="label"
    :style="{
      gridTemplateColumns: `repeat(${rows[0]?.length ?? 1}, ${size}px)`,
      gridTemplateRows: `repeat(${rows.length}, ${size}px)`,
    }"
  >
    <template v-for="(row, y) in rows" :key="y">
      <span
        v-for="(ch, x) in row.split('')"
        :key="x"
        :style="{ background: ch === '.' ? 'transparent' : colors[ch] }"
      />
    </template>
  </div>
</template>

<style scoped>
.pixel-icon {
  display: inline-grid;
}
.pixel-icon span {
  display: block;
}
</style>
