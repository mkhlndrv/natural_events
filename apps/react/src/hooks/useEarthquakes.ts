import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFilterStore } from '../store/filterStore';
import { fetchEarthquakes } from '../services/usgs';
import type { EarthquakeFeature } from '@terrawatch/shared';
import { mockEarthquakes } from '../components/__mocks__/eventData';

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
        if (
          (axios.isAxiosError(err) && err.response?.status === 503) ||
          (err instanceof Error && err.message.includes('503'))
        ) {
          setError(
            'The USGS Earthquake API is temporarily unavailable (503). Showing fallback data.'
          );
          setData(mockEarthquakes);
        } else {
          setError(
            err.message || 'An error occurred while fetching earthquakes.'
          );
          setData([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [minMagnitude, maxMagnitude, startDate, endDate]);

  return { data, loading, error };
}
