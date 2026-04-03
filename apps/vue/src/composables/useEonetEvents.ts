import { ref, watch } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useFilterStore } from '../stores/filterStore';
import { fetchEonetEvents } from '../services/eonet';
import type { EonetEvent } from '@terrawatch/shared';
import { mockEonetEvents } from '../components/__mocks__/eventData';

export function useEonetEvents() {
  const store = useFilterStore();
  const { eonetStatus, startDate, endDate } = storeToRefs(store);

  const data = ref<EonetEvent[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  watch(
    [eonetStatus, startDate, endDate],
    () => {
      loading.value = true;
      error.value = null;

      const params = {
        ...(eonetStatus.value === 'all'
          ? {}
          : { status: eonetStatus.value as 'open' | 'closed' }),
        // Date inputs from the dashboard are used for EONET filtering too.
        start: startDate.value,
        end: endDate.value,
      };

      fetchEonetEvents(params)
        .then((response) => {
          data.value = response.events;
        })
        .catch((err) => {
          if (
            (axios.isAxiosError(err) && err.response?.status === 503) ||
            (err instanceof Error && err.message.includes('503'))
          ) {
            error.value =
              'The NASA EONET API is temporarily unavailable (503). Showing fallback data.';
            data.value = mockEonetEvents;
          } else {
            error.value =
              err.message || 'An error occurred while fetching events.';
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
