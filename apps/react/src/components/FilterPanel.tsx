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
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex flex-wrap items-end gap-4">
        <fieldset>
          <legend className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Event Type
          </legend>
          <div className="flex rounded-lg border border-gray-200">
            {eventTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setEventType(t.value)}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${
                  eventType === t.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } first:rounded-l-lg last:rounded-r-lg`}
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
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
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
                className="w-24 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="max-magnitude"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
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
                className="w-24 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </>
        )}

        <div>
          <label
            htmlFor="start-date"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
          >
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="end-date"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
          >
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="eonet-status"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
          >
            EONET Status
          </label>
          <select
            id="eonet-status"
            value={eonetStatus}
            onChange={(e) =>
              setEonetStatus(e.target.value as 'all' | 'open' | 'closed')
            }
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
