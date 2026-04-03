<script setup lang="ts">
import { computed } from 'vue';
import type { EarthquakeFeature, EonetEvent } from '@terrawatch/shared';

const props = defineProps<{
  earthquakes: EarthquakeFeature[];
  eonetEvents: EonetEvent[];
}>();

const stats = computed(() => {
  const magnitudes = props.earthquakes
    .map((eq) => eq.properties.mag)
    .filter((m): m is number => m !== null);

  const strongest =
    magnitudes.length > 0 ? Math.max(...magnitudes).toFixed(1) : 'N/A';

  return [
    { label: 'Earthquakes', value: props.earthquakes.length },
    { label: 'Natural Events', value: props.eonetEvents.length },
    { label: 'Strongest Quake', value: strongest },
  ];
});
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="relative group overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-6 text-center shadow-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-slate-800/60"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>
      <div class="relative z-10">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          {{ stat.label }}
        </p>
        <p
          class="mt-3 text-4xl font-black bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
        >
          {{ stat.value }}
        </p>
      </div>
    </div>
  </div>
</template>
