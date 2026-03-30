import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFilterStore } from '../stores/filterStore';
import { fetchEonetEvents } from '../services/eonet';
import type { EonetEvent } from '@terrawatch/shared';

export function useEonetEvents() {
  const store = useFilterStore();
  const { eonetStatus } = storeToRefs(store);

  const data = ref<EonetEvent[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  watch(
    eonetStatus,
    () => {
      loading.value = true;
      error.value = null;

      const params =
        eonetStatus.value === 'all' ? {} : { status: eonetStatus.value };

      fetchEonetEvents(params)
        .then((response) => {
          data.value = response.events;
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
