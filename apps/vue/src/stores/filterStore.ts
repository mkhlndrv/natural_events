import { ref } from 'vue';
import { defineStore } from 'pinia';

function getDefaultDates() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

export const useFilterStore = defineStore('filter', () => {
  const eventType = ref<'all' | 'earthquakes' | 'natural'>('all');
  const minMagnitude = ref(2);
  const maxMagnitude = ref(10);
  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDates();
  const startDate = ref(defaultStart);
  const endDate = ref(defaultEnd);
  const eonetStatus = ref<'all' | 'open' | 'closed'>('open');

  function resetFilters() {
    const defaults = getDefaultDates();
    eventType.value = 'all';
    minMagnitude.value = 2;
    maxMagnitude.value = 10;
    startDate.value = defaults.startDate;
    endDate.value = defaults.endDate;
    eonetStatus.value = 'open';
  }

  return {
    eventType,
    minMagnitude,
    maxMagnitude,
    startDate,
    endDate,
    eonetStatus,
    resetFilters,
  };
});
