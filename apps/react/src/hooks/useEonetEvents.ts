import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFilterStore } from '../store/filterStore';
import { fetchEonetEvents } from '../services/eonet';
import type { EonetEvent } from '@terrawatch/shared';
import { mockEonetEvents } from '../components/__mocks__/eventData';

export function useEonetEvents() {
  const { eonetStatus, startDate, endDate } = useFilterStore();
  const [data, setData] = useState<EonetEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {
      ...(eonetStatus === 'all' ? {} : { status: eonetStatus }),
      // Date inputs from the dashboard are used for EONET filtering too.
      start: startDate,
      end: endDate,
    };

    fetchEonetEvents(params)
      .then((response) => {
        setData(response.events);
      })
      .catch((err) => {
        if (
          (axios.isAxiosError(err) && err.response?.status === 503) ||
          (err instanceof Error && err.message.includes('503'))
        ) {
          setError(
            'The NASA EONET API is temporarily unavailable (503). Showing fallback data.'
          );
          setData(mockEonetEvents);
        } else {
          setError(err.message || 'An error occurred while fetching events.');
          setData([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eonetStatus, startDate, endDate]);

  return { data, loading, error };
}
