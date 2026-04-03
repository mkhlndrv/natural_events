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
          className="relative overflow-hidden rounded-xl border border-white/5 bg-slate-900/50 p-5 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-slate-800/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>
            <p className="mt-2 text-4xl font-extrabold bg-gradient-to-r from-indigo-200 to-indigo-100 bg-clip-text text-transparent drop-shadow-sm">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
