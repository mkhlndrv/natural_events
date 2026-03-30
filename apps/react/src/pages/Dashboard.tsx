import { useEarthquakes } from '../hooks/useEarthquakes';
import { useEonetEvents } from '../hooks/useEonetEvents';
import { useFilterStore } from '../store/filterStore';
import EventMap from '../components/EventMap';
import FilterPanel from '../components/FilterPanel';
import StatsBar from '../components/StatsBar';

function Dashboard() {
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

  return (
    <div className="space-y-4">
      <FilterPanel />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-[500px] items-center justify-center rounded-lg bg-white shadow">
          <p className="text-gray-500">Loading events...</p>
        </div>
      ) : (
        <EventMap earthquakes={visibleQuakes} eonetEvents={visibleEonet} />
      )}

      <StatsBar earthquakes={visibleQuakes} eonetEvents={visibleEonet} />
    </div>
  );
}

export default Dashboard;
