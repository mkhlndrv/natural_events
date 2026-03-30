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
  <div class="rounded-lg bg-white p-4 shadow">
    <div class="flex flex-wrap items-end gap-4">
      <div>
        <label class="mb-1 block text-xs font-medium text-gray-600"
          >Event Type</label
        >
        <div class="flex rounded-md border border-gray-300">
          <button
            v-for="t in eventTypes"
            :key="t.value"
            :class="[
              'px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md',
              eventType === t.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50',
            ]"
            @click="eventType = t.value"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs font-medium text-gray-600"
          >Min Magnitude</label
        >
        <input
          type="number"
          :value="minMagnitude"
          :min="0"
          :max="10"
          :step="0.5"
          class="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          @input="
            minMagnitude = Number(($event.target as HTMLInputElement).value)
          "
        />
      </div>

      <div>
        <label class="mb-1 block text-xs font-medium text-gray-600"
          >Max Magnitude</label
        >
        <input
          type="number"
          :value="maxMagnitude"
          :min="0"
          :max="10"
          :step="0.5"
          class="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          @input="
            maxMagnitude = Number(($event.target as HTMLInputElement).value)
          "
        />
      </div>

      <div>
        <label class="mb-1 block text-xs font-medium text-gray-600"
          >Start Date</label
        >
        <input
          type="date"
          :value="startDate"
          class="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          @input="startDate = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div>
        <label class="mb-1 block text-xs font-medium text-gray-600"
          >End Date</label
        >
        <input
          type="date"
          :value="endDate"
          class="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          @input="endDate = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div>
        <label class="mb-1 block text-xs font-medium text-gray-600"
          >EONET Status</label
        >
        <select
          :value="eonetStatus"
          class="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
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
        class="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="store.resetFilters()"
      >
        Reset
      </button>
    </div>
  </div>
</template>
