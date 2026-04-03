import { useFilterStore } from '../store/filterStore';

const eventTypes = [
  { value: 'all', label: 'All' },
  { value: 'earthquakes', label: 'Earthquakes' },
  { value: 'natural', label: 'Natural Events' },
] as const;

function FilterPanel() {
  const {
    eventType,
    minMagnitude,
    maxMagnitude,
    startDate,
    endDate,
    eonetStatus,
    setEventType,
    setMinMagnitude,
    setMaxMagnitude,
    setStartDate,
    setEndDate,
    setEonetStatus,
    resetFilters,
  } = useFilterStore();

  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-end gap-4">
        <fieldset>
          <legend className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Event Type
          </legend>
          <div className="flex rounded-lg border border-white/10 bg-slate-900/30 p-1">
            {eventTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setEventType(t.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                  eventType === t.value
                    ? 'bg-indigo-500/20 text-indigo-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        {eventType !== 'natural' && (
          <>
            <div>
              <label
                htmlFor="min-magnitude"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                Min Magnitude
              </label>
              <input
                id="min-magnitude"
                type="number"
                value={minMagnitude}
                onChange={(e) => setMinMagnitude(Number(e.target.value))}
                min={0}
                max={10}
                step={0.5}
                className="w-24 rounded-lg border border-white/10 bg-slate-800/50 px-2.5 py-1.5 text-sm text-slate-200 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="max-magnitude"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                Max Magnitude
              </label>
              <input
                id="max-magnitude"
                type="number"
                value={maxMagnitude}
                onChange={(e) => setMaxMagnitude(Number(e.target.value))}
                min={0}
                max={10}
                step={0.5}
                className="w-24 rounded-lg border border-white/10 bg-slate-800/50 px-2.5 py-1.5 text-sm text-slate-200 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </>
        )}

        <div>
          <label
            htmlFor="start-date"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400"
          >
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-white/10 bg-slate-800/50 px-2.5 py-1.5 text-sm text-slate-200 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:[color-scheme:dark]"
          />
        </div>

        <div>
          <label
            htmlFor="end-date"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400"
          >
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-white/10 bg-slate-800/50 px-2.5 py-1.5 text-sm text-slate-200 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:[color-scheme:dark]"
          />
        </div>

        <div>
          <label
            htmlFor="eonet-status"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400"
          >
            EONET Status
          </label>
          <select
            id="eonet-status"
            value={eonetStatus}
            onChange={(e) =>
              setEonetStatus(e.target.value as 'all' | 'open' | 'closed')
            }
            className="rounded-lg border border-white/10 bg-slate-800/50 px-2.5 py-1.5 text-sm text-slate-200 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="rounded-lg border border-white/10 bg-slate-800/50 px-4 py-1.5 text-sm font-medium text-slate-400 transition-all duration-300 hover:border-white/20 hover:bg-slate-700 hover:text-slate-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
