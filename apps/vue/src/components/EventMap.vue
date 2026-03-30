<script setup lang="ts">
import 'leaflet';
import {
  LMap,
  LTileLayer,
  LCircleMarker,
  LPopup,
} from '@vue-leaflet/vue-leaflet';
import { RouterLink } from 'vue-router';
import type { EarthquakeFeature, EonetEvent } from '@terrawatch/shared';

defineProps<{
  earthquakes: EarthquakeFeature[];
  eonetEvents: EonetEvent[];
}>();

function getDepthColor(depth: number) {
  if (depth < 30) return '#f97316';
  if (depth < 100) return '#eab308';
  if (depth < 300) return '#22c55e';
  return '#3b82f6';
}

function getCategoryColor(categoryId: string) {
  const colors: Record<string, string> = {
    wildfires: '#ef4444',
    severeStorms: '#8b5cf6',
    volcanoes: '#f97316',
    seaLakeIce: '#06b6d4',
    snow: '#06b6d4',
  };
  return colors[categoryId] || '#6b7280';
}
</script>

<template>
  <div class="h-[500px] w-full rounded-lg shadow">
    <LMap :zoom="2" :center="[20, 0]" style="height: 100%; width: 100%">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <LCircleMarker
        v-for="eq in earthquakes"
        :key="eq.id"
        :lat-lng="[eq.geometry.coordinates[1], eq.geometry.coordinates[0]]"
        :radius="Math.max((eq.properties.mag ?? 1) * 3, 4)"
        :color="getDepthColor(eq.geometry.coordinates[2])"
        :fill-color="getDepthColor(eq.geometry.coordinates[2])"
        :fill-opacity="0.6"
      >
        <LPopup>
          <div class="text-sm">
            <p class="font-bold">M{{ (eq.properties.mag ?? 1).toFixed(1) }}</p>
            <p>{{ eq.properties.place }}</p>
            <p>Depth: {{ eq.geometry.coordinates[2].toFixed(1) }} km</p>
            <p>{{ new Date(eq.properties.time).toLocaleString() }}</p>
            <RouterLink
              :to="`/event/${eq.id}`"
              class="text-indigo-600 hover:underline"
            >
              View details
            </RouterLink>
          </div>
        </LPopup>
      </LCircleMarker>

      <template v-for="event in eonetEvents" :key="event.id">
        <LCircleMarker
          v-if="event.geometry.length > 0"
          :lat-lng="[
            event.geometry[event.geometry.length - 1].coordinates[1],
            event.geometry[event.geometry.length - 1].coordinates[0],
          ]"
          :radius="8"
          :color="getCategoryColor(event.categories[0]?.id || '')"
          :fill-color="getCategoryColor(event.categories[0]?.id || '')"
          :fill-opacity="0.6"
        >
          <LPopup>
            <div class="text-sm">
              <p class="font-bold">{{ event.title }}</p>
              <p>Category: {{ event.categories[0]?.title || 'Unknown' }}</p>
              <p>Status: {{ event.closed ? 'Closed' : 'Open' }}</p>
              <RouterLink
                :to="`/event/${event.id}`"
                class="text-indigo-600 hover:underline"
              >
                View details
              </RouterLink>
            </div>
          </LPopup>
        </LCircleMarker>
      </template>
    </LMap>
  </div>
</template>
