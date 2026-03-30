import axios from 'axios';
import { USGS_QUERY_URL } from '@terrawatch/shared';
import type {
  EarthquakeFeatureCollection,
  EarthquakeFeature,
} from '@terrawatch/shared';

interface UsgsParams {
  starttime?: string;
  endtime?: string;
  minmagnitude?: number;
  maxmagnitude?: number;
}

export async function fetchEarthquakes(
  params: UsgsParams
): Promise<EarthquakeFeatureCollection> {
  const response = await axios.get(USGS_QUERY_URL, {
    params: { format: 'geojson', ...params },
  });
  return response.data;
}

export async function fetchEarthquakeById(
  id: string
): Promise<EarthquakeFeature> {
  const response = await axios.get(USGS_QUERY_URL, {
    params: { format: 'geojson', eventid: id },
  });
  return response.data;
}
