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
  <div
    class="rounded-2xl border border-white/5 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-md"
  >
    <div class="flex flex-wrap items-end gap-6">
      <fieldset>
        <legend
          class="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400"
        >
          Event Type
        </legend>
        <div
          class="flex rounded-xl border border-white/10 bg-slate-950/40 p-1 shadow-inner"
        >
          <button
            v-for="t in eventTypes"
            :key="t.value"
            :class="[
              'px-4 py-1.5 text-sm font-semibold transition-all duration-300 rounded-lg',
              eventType === t.value
                ? 'bg-indigo-500/20 text-indigo-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-indigo-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50',
            ]"
            @click="eventType = t.value"
          >
            {{ t.label }}
          </button>
        </div>
      </fieldset>

      <div v-if="eventType !== 'natural'">
        <label
          for="min-magnitude"
          class="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
          >Min Magnitude</label
        >
        <input
          id="min-magnitude"
          type="number"
          :value="minMagnitude"
          :min="0"
          :max="10"
          :step="0.5"
          class="w-24 rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
          @input="
            minMagnitude = Number(($event.target as HTMLInputElement).value)
          "
        />
      </div>

      <div v-if="eventType !== 'natural'">
        <label
          for="max-magnitude"
          class="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
          >Max Magnitude</label
        >
        <input
          id="max-magnitude"
          type="number"
          :value="maxMagnitude"
          :min="0"
          :max="10"
          :step="0.5"
          class="w-24 rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
          @input="
            maxMagnitude = Number(($event.target as HTMLInputElement).value)
          "
        />
      </div>

      <div>
        <label
          for="start-date"
          class="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
          >Start Date</label
        >
        <input
          id="start-date"
          type="date"
          :value="startDate"
          class="rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:[color-scheme:dark]"
          @input="startDate = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div>
        <label
          for="end-date"
          class="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
          >End Date</label
        >
        <input
          id="end-date"
          type="date"
          :value="endDate"
          class="rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:[color-scheme:dark]"
          @input="endDate = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div>
        <label
          for="eonet-status"
          class="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
          >EONET Status</label
        >
        <select
          id="eonet-status"
          :value="eonetStatus"
          class="rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
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
        class="rounded-xl border border-white/10 bg-slate-800/50 px-5 py-2 text-sm font-bold text-slate-400 transition-all duration-300 hover:text-slate-100 hover:bg-slate-700 hover:border-white/20 active:scale-95"
        @click="store.resetFilters()"
      >
        Reset
      </button>
    </div>
  </div>
</template>
