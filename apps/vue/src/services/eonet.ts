import axios from 'axios';
import { EONET_EVENTS_URL } from '@terrawatch/shared';
import type { EonetResponse, EonetEvent } from '@terrawatch/shared';

interface EonetParams {
  status?: 'open' | 'closed';
  // EONET supports date filtering via `start`/`end` query params (YYYY-MM-DD).
  start?: string;
  end?: string;
  limit?: number;
}

export async function fetchEonetEvents(
  params: EonetParams = {}
): Promise<EonetResponse> {
  const response = await axios.get(EONET_EVENTS_URL, { params });
  return response.data;
}

export async function fetchEonetEventById(id: string): Promise<EonetEvent> {
  const response = await axios.get(`${EONET_EVENTS_URL}/${id}`);
  return response.data;
}
