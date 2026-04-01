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
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {{ stat.label }}
      </p>
      <p class="mt-1 text-2xl font-bold text-gray-900">{{ stat.value }}</p>
    </div>
  </div>
</template>
