import { ref, watch } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useFilterStore } from '../stores/filterStore';
import { fetchEarthquakes } from '../services/usgs';
import type { EarthquakeFeature } from '@terrawatch/shared';
import { mockEarthquakes } from '../components/__mocks__/eventData';

export function useEarthquakes() {
  const store = useFilterStore();
  const { minMagnitude, maxMagnitude, startDate, endDate } = storeToRefs(store);

  const data = ref<EarthquakeFeature[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  watch(
    [minMagnitude, maxMagnitude, startDate, endDate],
    () => {
      loading.value = true;
      error.value = null;

      fetchEarthquakes({
        starttime: startDate.value,
        endtime: endDate.value,
        minmagnitude: minMagnitude.value,
        maxmagnitude: maxMagnitude.value,
      })
        .then((response) => {
          data.value = response.features;
        })
        .catch((err) => {
          if (
            (axios.isAxiosError(err) && err.response?.status === 503) ||
            (err instanceof Error && err.message.includes('503'))
          ) {
            error.value =
              'The USGS Earthquake API is temporarily unavailable (503). Showing fallback data.';
            data.value = mockEarthquakes;
          } else {
            error.value =
              err.message || 'An error occurred while fetching earthquakes.';
            data.value = [];
          }
        })
        .finally(() => {
          loading.value = false;
        });
    },
    { immediate: true }
  );

  return { data, loading, error };
}
