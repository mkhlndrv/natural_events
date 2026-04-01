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
    <p class="text-gray-500">Loading event details...</p>
  </div>

  <!-- Error -->
  <div v-else-if="error" class="space-y-4">
    <RouterLink to="/" class="text-indigo-600 hover:underline">
      &#8592; Back to Dashboard
    </RouterLink>
    <div class="rounded-xl bg-red-50 p-4 text-red-600">{{ error }}</div>
  </div>

  <!-- Earthquake Detail -->
  <div v-else-if="!isEonet && earthquake" class="space-y-6">
    <RouterLink to="/" class="text-indigo-600 hover:underline">
      &#8592; Back to Dashboard
    </RouterLink>

    <div>
      <h1 class="text-2xl font-bold text-gray-900">
        {{ earthquake.properties.title }}
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        {{ new Date(earthquake.properties.time).toLocaleString() }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Details</h2>
        <dl class="space-y-3">
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Magnitude</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ earthquake.properties.mag ?? 'N/A' }}
              {{ earthquake.properties.magType ?? '' }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Location</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ earthquake.properties.place ?? 'Unknown' }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Depth</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ eqCoords!.depth.toFixed(1) }} km
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Felt Reports</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{
                earthquake.properties.felt !== null
                  ? earthquake.properties.felt
                  : 'None'
              }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Tsunami</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ earthquake.properties.tsunami === 1 ? 'Yes' : 'No' }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Status</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ earthquake.properties.status }}
            </dd>
          </div>
        </dl>
        <a
          :href="earthquake.properties.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          View on USGS &#8594;
        </a>
      </div>

      <div
        class="h-[300px] w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-100"
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
  <div v-else-if="isEonet && eonetEvent" class="space-y-6">
    <RouterLink to="/" class="text-indigo-600 hover:underline">
      &#8592; Back to Dashboard
    </RouterLink>

    <div>
      <h1 class="text-2xl font-bold text-gray-900">{{ eonetEvent.title }}</h1>
      <p class="mt-1 text-sm text-gray-500">
        Category: {{ eonetEvent.categories[0]?.title ?? 'Unknown' }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Details</h2>
        <dl class="space-y-3">
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Category</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ eonetEvent.categories[0]?.title ?? 'Unknown' }}
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Status</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ eonetEvent.closed ? 'Closed' : 'Open' }}
            </dd>
          </div>
          <div v-if="eonetEvent.closed" class="flex justify-between">
            <dt class="text-sm text-gray-500">Closed</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ new Date(eonetEvent.closed).toLocaleDateString() }}
            </dd>
          </div>
          <div v-if="eonetCoords" class="flex justify-between">
            <dt class="text-sm text-gray-500">Coordinates</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ eonetCoords.lat.toFixed(2) }},
              {{ eonetCoords.lon.toFixed(2) }}
            </dd>
          </div>
          <div v-if="eonetCoords?.date" class="flex justify-between">
            <dt class="text-sm text-gray-500">Last Updated</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ new Date(eonetCoords.date).toLocaleString() }}
            </dd>
          </div>
        </dl>

        <div v-if="eonetEvent.sources.length > 0" class="mt-4">
          <p class="text-sm font-medium text-gray-600">Sources</p>
          <ul class="mt-1 space-y-1">
            <li v-for="source in eonetEvent.sources" :key="source.id">
              <a
                :href="source.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-indigo-600 hover:underline"
              >
                {{ source.id }} &#8594;
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="eonetCoords"
        class="h-[300px] w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-100"
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
