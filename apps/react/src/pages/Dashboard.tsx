import { lazy, Suspense, useState, useEffect } from 'react';
import { useEarthquakes } from '../hooks/useEarthquakes';
import { useEonetEvents } from '../hooks/useEonetEvents';
import { useFilterStore } from '../store/filterStore';
import FilterPanel from '../components/FilterPanel';
import StatsBar from '../components/StatsBar';

const EventMap = lazy(() => import('../components/EventMap'));

function Dashboard() {
  const [mapReady, setMapReady] = useState(false);
  const { data: earthquakes, error: eqError } = useEarthquakes();
  const { data: eonetEvents, error: eoError } = useEonetEvents();
  const eventType = useFilterStore((s) => s.eventType);

  useEffect(() => {
    const id = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  const visibleQuakes = eventType === 'natural' ? [] : earthquakes;
  const visibleEonet = eventType === 'earthquakes' ? [] : eonetEvents;

  const error = eqError || eoError;

  return (
    <div className="space-y-5">
      <FilterPanel />

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {mapReady ? (
        <Suspense
          fallback={
            <div className="flex h-[500px] items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
              <p className="text-sm text-gray-400">Loading map...</p>
            </div>
          }
        >
          <EventMap earthquakes={visibleQuakes} eonetEvents={visibleEonet} />
        </Suspense>
      ) : (
        <div className="flex h-[500px] items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <p className="text-sm text-gray-400">Loading map...</p>
        </div>
      )}

      <StatsBar earthquakes={visibleQuakes} eonetEvents={visibleEonet} />
    </div>
  );
}

export default Dashboard;
