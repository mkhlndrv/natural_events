import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFilterStore } from '../stores/filterStore';
import { fetchEarthquakes } from '../services/usgs';
import type { EarthquakeFeature } from '@terrawatch/shared';

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
          error.value = err.message;
          data.value = [];
        })
        .finally(() => {
          loading.value = false;
        });
    },
    { immediate: true }
  );

  return { data, loading, error };
}
