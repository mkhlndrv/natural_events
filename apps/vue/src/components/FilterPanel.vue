<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useFilterStore } from '../stores/filterStore';

const store = useFilterStore();
const {
  eventType,
  minMagnitude,
  maxMagnitude,
  startDate,
  endDate,
  eonetStatus,
} = storeToRefs(store);

const eventTypes = [
  { value: 'all' as const, label: 'All' },
  { value: 'earthquakes' as const, label: 'Earthquakes' },
  { value: 'natural' as const, label: 'Natural Events' },
];
</script>

<template>
  <div class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
    <div class="flex flex-wrap items-end gap-4">
      <fieldset>
        <legend
          class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400"
        >
          Event Type
        </legend>
        <div class="flex rounded-lg border border-gray-200">
          <button
            v-for="t in eventTypes"
            :key="t.value"
            :class="[
              'px-3 py-1.5 text-sm font-medium transition-all first:rounded-l-lg last:rounded-r-lg',
              eventType === t.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50',
            ]"
            @click="eventType = t.value"
          >
            {{ t.label }}
          </button>
        </div>
      </fieldset>

      <div>
        <label
          for="min-magnitude"
          class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
          >Min Magnitude</label
        >
        <input
          id="min-magnitude"
          type="number"
          :value="minMagnitude"
          :min="0"
          :max="10"
          :step="0.5"
          class="w-24 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          @input="
            minMagnitude = Number(($event.target as HTMLInputElement).value)
          "
        />
      </div>

      <div>
        <label
          for="max-magnitude"
          class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
          >Max Magnitude</label
        >
        <input
          id="max-magnitude"
          type="number"
          :value="maxMagnitude"
          :min="0"
          :max="10"
          :step="0.5"
          class="w-24 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          @input="
            maxMagnitude = Number(($event.target as HTMLInputElement).value)
          "
        />
      </div>

      <div>
        <label
          for="start-date"
          class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
          >Start Date</label
        >
        <input
          id="start-date"
          type="date"
          :value="startDate"
          class="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          @input="startDate = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div>
        <label
          for="end-date"
          class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
          >End Date</label
        >
        <input
          id="end-date"
          type="date"
          :value="endDate"
          class="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          @input="endDate = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div>
        <label
          for="eonet-status"
          class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
          >EONET Status</label
        >
        <select
          id="eonet-status"
          :value="eonetStatus"
          class="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          @change="
            eonetStatus = ($event.target as HTMLSelectElement).value as
              | 'all'
              | 'open'
              | 'closed'
          "
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <button
        class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
        @click="store.resetFilters()"
      >
        Reset
      </button>
    </div>
  </div>
</template>
