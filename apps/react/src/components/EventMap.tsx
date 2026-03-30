import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import type { EarthquakeFeature, EonetEvent } from '@terrawatch/shared';
import type { LatLngExpression } from 'leaflet';

interface EventMapProps {
  earthquakes: EarthquakeFeature[];
  eonetEvents: EonetEvent[];
}

function getDepthColor(depth: number) {
  if (depth < 30) return '#f97316';
  if (depth < 100) return '#eab308';
  if (depth < 300) return '#22c55e';
  return '#3b82f6';
}

function getCategoryColor(categoryId: string) {
  const colors: Record<string, string> = {
    wildfires: '#ef4444',
    severeStorms: '#8b5cf6',
    volcanoes: '#f97316',
    seaLakeIce: '#06b6d4',
    snow: '#06b6d4',
  };
  return colors[categoryId] || '#6b7280';
}

function EventMap({ earthquakes, eonetEvents }: EventMapProps) {
  const center: LatLngExpression = [20, 0];

  return (
    <MapContainer
      center={center}
      zoom={2}
      className="h-[500px] w-full rounded-lg shadow"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {earthquakes.map((eq) => {
        const [lon, lat, depth] = eq.geometry.coordinates;
        const mag = eq.properties.mag ?? 1;
        const color = getDepthColor(depth);
        const radius = Math.max(mag * 3, 4);

        return (
          <CircleMarker
            key={eq.id}
            center={[lat, lon]}
            radius={radius}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">M{mag.toFixed(1)}</p>
                <p>{eq.properties.place}</p>
                <p>Depth: {depth.toFixed(1)} km</p>
                <p>{new Date(eq.properties.time).toLocaleString()}</p>
                <Link
                  to={`/event/${eq.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  View details
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {eonetEvents.map((event) => {
        if (event.geometry.length === 0) return null;
        const geo = event.geometry[event.geometry.length - 1];
        const [lon, lat] = geo.coordinates;
        const categoryId = event.categories[0]?.id || '';
        const color = getCategoryColor(categoryId);

        return (
          <CircleMarker
            key={event.id}
            center={[lat, lon]}
            radius={8}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{event.title}</p>
                <p>Category: {event.categories[0]?.title || 'Unknown'}</p>
                <p>Status: {event.closed ? 'Closed' : 'Open'}</p>
                <Link
                  to={`/event/${event.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  View details
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export default EventMap;
