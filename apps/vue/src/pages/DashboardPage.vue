<script setup lang="ts">
import { computed, defineAsyncComponent, h, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEarthquakes } from '../composables/useEarthquakes';
import { useEonetEvents } from '../composables/useEonetEvents';
import { useFilterStore } from '../stores/filterStore';
import FilterPanel from '../components/FilterPanel.vue';
import StatsBar from '../components/StatsBar.vue';

const MapPlaceholder = {
  render() {
    return h(
      'div',
      {
        class:
          'flex h-[500px] items-center justify-center rounded-2xl border border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-md',
      },
      [
        h(
          'p',
          {
            class: 'text-sm font-bold uppercase tracking-widest text-slate-500',
          },
          'Loading map resources...'
        ),
      ]
    );
  },
};

const EventMap = defineAsyncComponent({
  loader: () => import('../components/EventMap.vue'),
  loadingComponent: MapPlaceholder,
  delay: 0,
});

const mapReady = ref(false);
onMounted(() => {
  setTimeout(() => {
    mapReady.value = true;
  }, 100);
});

const { data: earthquakes, error: eqError } = useEarthquakes();
const { data: eonetEvents, error: eoError } = useEonetEvents();

const { eventType } = storeToRefs(useFilterStore());

const visibleQuakes = computed(() =>
  eventType.value === 'natural' ? [] : earthquakes.value
);
const visibleEonet = computed(() =>
  eventType.value === 'earthquakes' ? [] : eonetEvents.value
);
const error = computed(() => eqError.value || eoError.value);
</script>

<template>
  <div class="space-y-8 fade-in">
    <FilterPanel />

    <div
      v-if="error"
      class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 backdrop-blur-md"
    >
      {{ error }}
    </div>

    <EventMap
      v-if="mapReady"
      :earthquakes="visibleQuakes"
      :eonet-events="visibleEonet"
    />
    <component :is="MapPlaceholder" v-else />

    <StatsBar :earthquakes="visibleQuakes" :eonet-events="visibleEonet" />
  </div>
</template>
