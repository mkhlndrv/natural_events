import { useState, useEffect } from 'react';
import { useFilterStore } from '../store/filterStore';
import { fetchEonetEvents } from '../services/eonet';
import type { EonetEvent } from '@terrawatch/shared';

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
        setError(err.message);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eonetStatus, startDate, endDate]);

  return { data, loading, error };
}
