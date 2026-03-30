<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useEarthquakes } from '../composables/useEarthquakes';
import { useEonetEvents } from '../composables/useEonetEvents';
import { useFilterStore } from '../stores/filterStore';
import EventMap from '../components/EventMap.vue';
import FilterPanel from '../components/FilterPanel.vue';
import StatsBar from '../components/StatsBar.vue';

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
</script>

<template>
  <div class="space-y-4">
    <FilterPanel />

    <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>

    <div
      v-if="loading"
      class="flex h-[500px] items-center justify-center rounded-lg bg-white shadow"
    >
      <p class="text-gray-500">Loading events...</p>
    </div>
    <EventMap
      v-else
      :earthquakes="visibleQuakes"
      :eonet-events="visibleEonet"
    />

    <StatsBar :earthquakes="visibleQuakes" :eonet-events="visibleEonet" />
  </div>
</template>
