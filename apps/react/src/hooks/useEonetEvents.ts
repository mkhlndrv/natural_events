import { useState, useEffect } from 'react';
import { useFilterStore } from '../store/filterStore';
import { fetchEonetEvents } from '../services/eonet';
import type { EonetEvent } from '@terrawatch/shared';

export function useEonetEvents() {
  const { eonetStatus } = useFilterStore();
  const [data, setData] = useState<EonetEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = eonetStatus === 'all' ? {} : { status: eonetStatus };

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
  }, [eonetStatus]);

  return { data, loading, error };
}
