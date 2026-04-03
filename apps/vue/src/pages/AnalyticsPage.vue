<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Bar, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { useEarthquakes } from '../composables/useEarthquakes';
import { useEonetEvents } from '../composables/useEonetEvents';
import { useFilterStore } from '../stores/filterStore';
import FilterPanel from '../components/FilterPanel.vue';
import type { EarthquakeFeature, EonetEvent } from '@terrawatch/shared';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip
);

function getMagnitudeData(quakes: EarthquakeFeature[]) {
  const buckets: Record<string, number> = {
    'M2-3': 0,
    'M3-4': 0,
    'M4-5': 0,
    'M5-6': 0,
    'M6-7': 0,
    'M7+': 0,
  };

  for (const eq of quakes) {
    const mag = eq.properties.mag;
    if (mag === null) continue;

    if (mag >= 7) buckets['M7+']++;
    else if (mag >= 6) buckets['M6-7']++;
    else if (mag >= 5) buckets['M5-6']++;
    else if (mag >= 4) buckets['M4-5']++;
    else if (mag >= 3) buckets['M3-4']++;
    else if (mag >= 2) buckets['M2-3']++;
  }

  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}

function getTimelineData(
  quakes: EarthquakeFeature[],
  eonetEvents: EonetEvent[]
) {
  const counts: Record<string, number> = {};

  for (const eq of quakes) {
    const date = new Date(eq.properties.time).toISOString().split('T')[0];
    counts[date] = (counts[date] || 0) + 1;
  }

  for (const event of eonetEvents) {
    const geo = event.geometry[event.geometry.length - 1];
    if (!geo?.date) continue;
    const date = new Date(geo.date).toISOString().split('T')[0];
    counts[date] = (counts[date] || 0) + 1;
  }

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

const {
  data: earthquakes,
  loading: eqLoading,
  error: eqError,
} = useEarthquakes();
const {
  data: eonetEvents,
  loading: eoLoading,
  error: eoError,
} = useEonetEvents();

const { eventType } = storeToRefs(useFilterStore());

const visibleQuakes = computed(() =>
  eventType.value === 'natural' ? [] : earthquakes.value
);
const visibleEonet = computed(() =>
  eventType.value === 'earthquakes' ? [] : eonetEvents.value
);
const loading = computed(() => eqLoading.value || eoLoading.value);
const error = computed(() => eqError.value || eoError.value);
const hasData = computed(
  () => visibleQuakes.value.length > 0 || visibleEonet.value.length > 0
);

const magnitudeData = computed(() => getMagnitudeData(visibleQuakes.value));
const timelineData = computed(() =>
  getTimelineData(visibleQuakes.value, visibleEonet.value)
);

const magnitudeChartData = computed(() => ({
  labels: magnitudeData.value.map((d) => d.range),
  datasets: [
    {
      data: magnitudeData.value.map((d) => d.count),
      backgroundColor: '#6366f1',
    },
  ],
}));

const timelineChartData = computed(() => ({
  labels: timelineData.value.map((d) => d.date),
  datasets: [
    {
      data: timelineData.value.map((d) => d.count),
      borderColor: '#6366f1',
      pointRadius: 0,
      tension: 0.4,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { ticks: { precision: 0 } } },
  plugins: { legend: { display: false } },
};
</script>

<template>
  <div class="space-y-8 fade-in">
    <FilterPanel />

    <div
      v-if="error"
      class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 backdrop-blur-sm"
    >
      {{ error }}
    </div>

    <div v-if="loading" class="flex h-64 items-center justify-center">
      <p class="text-sm font-bold uppercase tracking-widest text-slate-500">
        Processing Analytics...
      </p>
    </div>

    <div
      v-else-if="!hasData"
      class="flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-md"
    >
      <p class="text-sm font-medium text-slate-400">
        No events match your current filters.
      </p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2">
      <div
        class="rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md"
      >
        <h2
          class="mb-6 text-xl font-bold text-slate-200 border-b border-white/5 pb-3"
        >
          Magnitude Distribution
        </h2>
        <div v-if="visibleQuakes.length > 0" class="h-[300px]">
          <Bar :data="magnitudeChartData" :options="chartOptions" />
        </div>
        <p v-else class="py-12 text-center text-gray-400">
          No earthquake data to chart.
        </p>
      </div>

      <div
        class="rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md"
      >
        <h2
          class="mb-6 text-xl font-bold text-slate-200 border-b border-white/5 pb-3"
        >
          Events Over Time
        </h2>
        <div class="h-[300px]">
          <Line :data="timelineChartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>
