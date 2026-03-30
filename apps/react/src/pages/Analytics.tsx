import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEarthquakes } from '../hooks/useEarthquakes';
import { useEonetEvents } from '../hooks/useEonetEvents';
import { useFilterStore } from '../store/filterStore';
import FilterPanel from '../components/FilterPanel';
import type { EarthquakeFeature, EonetEvent } from '@terrawatch/shared';

function getMagnitudeData(quakes: EarthquakeFeature[]) {
  const buckets: Record<string, number> = {
    'M2-3': 0,
    'M3-4': 0,
    'M4-5': 0,
    'M5-6': 0,
    'M6-7': 0,
    'M7+': 0,
  };

  for (const eq of quakes) {
    const mag = eq.properties.mag;
    if (mag === null) continue;

    if (mag >= 7) buckets['M7+']++;
    else if (mag >= 6) buckets['M6-7']++;
    else if (mag >= 5) buckets['M5-6']++;
    else if (mag >= 4) buckets['M4-5']++;
    else if (mag >= 3) buckets['M3-4']++;
    else if (mag >= 2) buckets['M2-3']++;
  }

  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}

function getTimelineData(
  quakes: EarthquakeFeature[],
  eonetEvents: EonetEvent[]
) {
  const counts: Record<string, number> = {};

  for (const eq of quakes) {
    const date = new Date(eq.properties.time).toISOString().split('T')[0];
    counts[date] = (counts[date] || 0) + 1;
  }

  for (const event of eonetEvents) {
    const geo = event.geometry[event.geometry.length - 1];
    if (!geo?.date) continue;
    const date = new Date(geo.date).toISOString().split('T')[0];
    counts[date] = (counts[date] || 0) + 1;
  }

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

function Analytics() {
  const {
    data: earthquakes,
    loading: eqLoading,
    error: eqError,
  } = useEarthquakes();
  const {
    data: eonetEvents,
    loading: eoLoading,
    error: eoError,
  } = useEonetEvents();
  const eventType = useFilterStore((s) => s.eventType);

  const visibleQuakes = eventType === 'natural' ? [] : earthquakes;
  const visibleEonet = eventType === 'earthquakes' ? [] : eonetEvents;

  const loading = eqLoading || eoLoading;
  const error = eqError || eoError;

  const magnitudeData = getMagnitudeData(visibleQuakes);
  const timelineData = getTimelineData(visibleQuakes, visibleEonet);
  const hasData = visibleQuakes.length > 0 || visibleEonet.length > 0;

  return (
    <div className="space-y-4">
      <FilterPanel />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      ) : !hasData ? (
        <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow">
          <p className="text-gray-500">No events match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Magnitude Distribution
            </h2>
            {visibleQuakes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={magnitudeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-gray-400">
                No earthquake data to chart.
              </p>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Events Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
