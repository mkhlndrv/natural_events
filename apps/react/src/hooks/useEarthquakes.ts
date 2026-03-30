import { useState, useEffect } from 'react';
import { useFilterStore } from '../store/filterStore';
import { fetchEarthquakes } from '../services/usgs';
import type { EarthquakeFeature } from '@terrawatch/shared';

export function useEarthquakes() {
  const { minMagnitude, maxMagnitude, startDate, endDate } = useFilterStore();
  const [data, setData] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchEarthquakes({
      starttime: startDate,
      endtime: endDate,
      minmagnitude: minMagnitude,
      maxmagnitude: maxMagnitude,
    })
      .then((response) => {
        setData(response.features);
      })
      .catch((err) => {
        setError(err.message);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [minMagnitude, maxMagnitude, startDate, endDate]);

  return { data, loading, error };
}
