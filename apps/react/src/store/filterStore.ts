import { create } from 'zustand';

interface FilterState {
  eventType: 'all' | 'earthquakes' | 'natural';
  minMagnitude: number;
  maxMagnitude: number;
  startDate: string;
  endDate: string;
  eonetStatus: 'all' | 'open' | 'closed';
  setEventType: (type: FilterState['eventType']) => void;
  setMinMagnitude: (val: number) => void;
  setMaxMagnitude: (val: number) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setEonetStatus: (status: FilterState['eonetStatus']) => void;
  resetFilters: () => void;
}

function getDefaultDates() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

export const useFilterStore = create<FilterState>((set) => ({
  eventType: 'all',
  minMagnitude: 2,
  maxMagnitude: 10,
  ...getDefaultDates(),
  eonetStatus: 'open',
  setEventType: (eventType) => set({ eventType }),
  setMinMagnitude: (minMagnitude) => set({ minMagnitude }),
  setMaxMagnitude: (maxMagnitude) => set({ maxMagnitude }),
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setEonetStatus: (eonetStatus) => set({ eonetStatus }),
  resetFilters: () =>
    set({
      eventType: 'all',
      minMagnitude: 2,
      maxMagnitude: 10,
      ...getDefaultDates(),
      eonetStatus: 'open',
    }),
}));
