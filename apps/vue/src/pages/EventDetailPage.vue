<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { LMap, LTileLayer, LCircleMarker } from '@vue-leaflet/vue-leaflet';
import { fetchEarthquakeById } from '../services/usgs';
import { fetchEonetEventById } from '../services/eonet';
import type { EarthquakeFeature, EonetEvent } from '@terrawatch/shared';

const route = useRoute();
const id = route.params.id as string;
const isEonet = id.startsWith('EONET_');

const earthquake = ref<EarthquakeFeature | null>(null);
const eonetEvent = ref<EonetEvent | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const eqCoords = computed(() => {
  if (!earthquake.value) return null;
  const [lon, lat, depth] = earthquake.value.geometry.coordinates;
  return { lat, lon, depth };
});

const eonetCoords = computed(() => {
  if (!eonetEvent.value || eonetEvent.value.geometry.length === 0) return null;
  const geo = eonetEvent.value.geometry[eonetEvent.value.geometry.length - 1];
  const [lon, lat] = geo.coordinates;
  return { lat, lon, date: geo.date };
});

onMounted(() => {
  if (isEonet) {
    fetchEonetEventById(id)
      .then((data) => {
        eonetEvent.value = data;
      })
      .catch((err) => {
        error.value = err.message;
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    fetchEarthquakeById(id)
      .then((data) => {
        earthquake.value = data;
      })
      .catch((err) => {
        error.value = err.message;
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="flex h-64 items-center justify-center">
    <p class="text-sm font-bold uppercase tracking-widest text-slate-500">
      Retrieving Event Data...
    </p>
  </div>

  <!-- Error -->
  <div v-else-if="error" class="space-y-4 fade-in">
    <RouterLink
      to="/"
      class="inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
    >
      &#8592; Back to Dashboard
    </RouterLink>
    <div
      class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 backdrop-blur-md"
    >
      {{ error }}
    </div>
  </div>

  <!-- Earthquake Detail -->
  <div v-else-if="!isEonet && earthquake" class="space-y-10 fade-in">
    <RouterLink
      to="/"
      class="inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
    >
      &#8592; Back to Dashboard
    </RouterLink>

    <div>
      <h1
        class="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent"
      >
        {{ earthquake.properties.title }}
      </h1>
      <p class="mt-2 text-sm font-medium text-slate-500">
        {{ new Date(earthquake.properties.time).toLocaleString() }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div
        class="rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md"
      >
        <h2
          class="mb-6 text-xl font-bold text-slate-200 border-b border-white/5 pb-3"
        >
          Details
        </h2>
        <dl class="space-y-5">
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Magnitude</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ earthquake.properties.mag ?? 'N/A' }}
              {{ earthquake.properties.magType ?? '' }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Location</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ earthquake.properties.place ?? 'Unknown' }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Depth</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ eqCoords!.depth.toFixed(1) }} km
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Felt Reports</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{
                earthquake.properties.felt !== null
                  ? earthquake.properties.felt
                  : 'None'
              }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Tsunami</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ earthquake.properties.tsunami === 1 ? 'Yes' : 'No' }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Status</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ earthquake.properties.status }}
            </dd>
          </div>
        </dl>
        <a
          :href="earthquake.properties.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-8 inline-block text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
        >
          View on USGS &#8594;
        </a>
      </div>

      <div
        class="h-[400px] w-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md"
      >
        <LMap
          :center="[eqCoords!.lat, eqCoords!.lon]"
          :zoom="6"
          :options="{ scrollWheelZoom: false }"
          style="height: 100%; width: 100%"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <LCircleMarker
            :lat-lng="[eqCoords!.lat, eqCoords!.lon]"
            :radius="10"
            color="#f97316"
            fill-color="#f97316"
            :fill-opacity="0.6"
          />
        </LMap>
      </div>
    </div>
  </div>

  <!-- EONET Detail -->
  <div v-else-if="isEonet && eonetEvent" class="space-y-10 fade-in">
    <RouterLink
      to="/"
      class="inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
    >
      &#8592; Back to Dashboard
    </RouterLink>

    <div>
      <h1
        class="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent"
      >
        {{ eonetEvent.title }}
      </h1>
      <p class="mt-2 text-sm font-medium text-slate-500">
        Category: {{ eonetEvent.categories[0]?.title ?? 'Unknown' }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div
        class="rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md"
      >
        <h2
          class="mb-6 text-xl font-bold text-slate-200 border-b border-white/5 pb-3"
        >
          Details
        </h2>
        <dl class="space-y-5">
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Category</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ eonetEvent.categories[0]?.title ?? 'Unknown' }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Status</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ eonetEvent.closed ? 'Closed' : 'Open' }}
            </dd>
          </div>
          <div v-if="eonetEvent.closed" class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Closed</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ new Date(eonetEvent.closed).toLocaleDateString() }}
            </dd>
          </div>
          <div v-if="eonetCoords" class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Coordinates</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ eonetCoords.lat.toFixed(2) }},
              {{ eonetCoords.lon.toFixed(2) }}
            </dd>
          </div>
          <div v-if="eonetCoords?.date" class="flex justify-between">
            <dt class="text-sm font-medium text-slate-400">Last Updated</dt>
            <dd class="text-sm font-bold text-slate-100">
              {{ new Date(eonetCoords.date).toLocaleString() }}
            </dd>
          </div>
        </dl>

        <div v-if="eonetEvent.sources.length > 0" class="mt-8">
          <p class="text-sm font-bold text-slate-400">Sources</p>
          <ul class="mt-1 space-y-1">
            <li v-for="source in eonetEvent.sources" :key="source.id">
              <a
                :href="source.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
              >
                {{ source.id }} &#8594;
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="eonetCoords"
        class="h-[400px] w-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md"
      >
        <LMap
          :center="[eonetCoords.lat, eonetCoords.lon]"
          :zoom="6"
          :options="{ scrollWheelZoom: false }"
          style="height: 100%; width: 100%"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <LCircleMarker
            :lat-lng="[eonetCoords.lat, eonetCoords.lon]"
            :radius="10"
            color="#ef4444"
            fill-color="#ef4444"
            :fill-opacity="0.6"
          />
        </LMap>
      </div>
    </div>
  </div>
</template>
