import type { EarthquakeFeature, EonetEvent } from '@terrawatch/shared';

interface StatsBarProps {
  earthquakes: EarthquakeFeature[];
  eonetEvents: EonetEvent[];
}

function StatsBar({ earthquakes, eonetEvents }: StatsBarProps) {
  const magnitudes = earthquakes
    .map((eq) => eq.properties.mag)
    .filter((m): m is number => m !== null);

  const strongest =
    magnitudes.length > 0 ? Math.max(...magnitudes).toFixed(1) : 'N/A';

  const stats = [
    { label: 'Earthquakes', value: earthquakes.length },
    { label: 'Natural Events', value: eonetEvents.length },
    { label: 'Strongest Quake', value: strongest },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {stat.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
