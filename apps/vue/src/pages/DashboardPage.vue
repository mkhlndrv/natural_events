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
          'flex h-[500px] items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100',
      },
      [h('p', { class: 'text-sm text-gray-400' }, 'Loading map...')]
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
  <div class="space-y-5">
    <FilterPanel />

    <div v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-600">
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
