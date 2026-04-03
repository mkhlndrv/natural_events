import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { fetchEarthquakeById } from '../services/usgs';
import { fetchEonetEventById } from '../services/eonet';
import type { EarthquakeFeature, EonetEvent } from '@terrawatch/shared';
import type { LatLngExpression } from 'leaflet';

function EventDetail() {
  const { id } = useParams();
  const isEonet = id?.startsWith('EONET_');

  const [earthquake, setEarthquake] = useState<EarthquakeFeature | null>(null);
  const [eonetEvent, setEonetEvent] = useState<EonetEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    if (isEonet) {
      fetchEonetEventById(id)
        .then((data) => setEonetEvent(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      fetchEarthquakeById(id)
        .then((data) => setEarthquake(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEonet]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
          Loading event details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-block text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
        >
          &larr; Back to Dashboard
        </Link>
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 backdrop-blur-sm">
          {error}
        </div>
      </div>
    );
  }

  if (isEonet && eonetEvent) {
    return <EonetDetail event={eonetEvent} />;
  }

  if (!isEonet && earthquake) {
    return <EarthquakeDetail event={earthquake} />;
  }

  return null;
}

function EarthquakeDetail({ event }: { event: EarthquakeFeature }) {
  const { properties: p, geometry } = event;
  const [lon, lat, depth] = geometry.coordinates;
  const center: LatLngExpression = [lat, lon];

  return (
    <div className="space-y-8 fade-in">
      <Link
        to="/"
        className="inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
      >
        &larr; Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          {p.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          {new Date(p.time).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
          <h2 className="mb-6 text-lg font-semibold text-slate-200 border-b border-white/5 pb-2">
            Details
          </h2>
          <dl className="space-y-4">
            <DetailRow
              label="Magnitude"
              value={`${p.mag ?? 'N/A'} ${p.magType ?? ''}`}
            />
            <DetailRow label="Location" value={p.place ?? 'Unknown'} />
            <DetailRow label="Depth" value={`${depth.toFixed(1)} km`} />
            <DetailRow
              label="Felt Reports"
              value={p.felt !== null ? String(p.felt) : 'None'}
            />
            <DetailRow label="Tsunami" value={p.tsunami === 1 ? 'Yes' : 'No'} />
            <DetailRow label="Status" value={p.status} />
          </dl>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            View on USGS &rarr;
          </a>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/5 shadow-xl backdrop-blur-md">
          <MapContainer
            center={center}
            zoom={6}
            className="h-[300px] w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CircleMarker
              center={center}
              radius={10}
              pathOptions={{
                color: '#f97316',
                fillColor: '#f97316',
                fillOpacity: 0.6,
              }}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

function EonetDetail({ event }: { event: EonetEvent }) {
  const geo = event.geometry[event.geometry.length - 1];
  const [lon, lat] = geo?.coordinates ?? [0, 0];
  const center: LatLngExpression = [lat, lon];
  const category = event.categories[0]?.title ?? 'Unknown';

  return (
    <div className="space-y-8 fade-in">
      <Link
        to="/"
        className="inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
      >
        &larr; Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          {event.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Category: {category}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
          <h2 className="mb-6 text-lg font-semibold text-slate-200 border-b border-white/5 pb-2">
            Details
          </h2>
          <dl className="space-y-4">
            <DetailRow label="Category" value={category} />
            <DetailRow
              label="Status"
              value={event.closed ? 'Closed' : 'Open'}
            />
            {event.closed && (
              <DetailRow
                label="Closed"
                value={new Date(event.closed).toLocaleDateString()}
              />
            )}
            <DetailRow
              label="Coordinates"
              value={`${lat.toFixed(2)}, ${lon.toFixed(2)}`}
            />
            {geo?.date && (
              <DetailRow
                label="Last Updated"
                value={new Date(geo.date).toLocaleString()}
              />
            )}
          </dl>

          {event.sources.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600">Sources</p>
              <ul className="mt-1 space-y-1">
                {event.sources.map((source) => (
                  <li key={source.id}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      {source.id} &rarr;
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-white/5 shadow-xl backdrop-blur-md">
          <MapContainer
            center={center}
            zoom={6}
            className="h-[300px] w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CircleMarker
              center={center}
              radius={10}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.6,
              }}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="text-sm font-medium text-slate-200">{value}</dd>
    </div>
  );
}

export default EventDetail;
