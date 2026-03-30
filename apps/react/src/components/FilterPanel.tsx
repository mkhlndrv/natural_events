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
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="flex flex-wrap items-end gap-4">
        <fieldset>
          <legend className="mb-1 text-xs font-medium text-gray-600">
            Event Type
          </legend>
          <div className="flex rounded-md border border-gray-300">
            {eventTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setEventType(t.value)}
                className={`px-3 py-1.5 text-sm font-medium ${
                  eventType === t.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } first:rounded-l-md last:rounded-r-md`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="min-magnitude"
            className="mb-1 block text-xs font-medium text-gray-600"
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
            className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="max-magnitude"
            className="mb-1 block text-xs font-medium text-gray-600"
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
            className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="start-date"
            className="mb-1 block text-xs font-medium text-gray-600"
          >
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="end-date"
            className="mb-1 block text-xs font-medium text-gray-600"
          >
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="eonet-status"
            className="mb-1 block text-xs font-medium text-gray-600"
          >
            EONET Status
          </label>
          <select
            id="eonet-status"
            value={eonetStatus}
            onChange={(e) =>
              setEonetStatus(e.target.value as 'all' | 'open' | 'closed')
            }
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
