<script setup lang="ts">
const techStack = [
  'Vue',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'Vue Router',
  'Leaflet',
  'vue-chartjs',
  'Pinia',
  'Axios',
  'Vitest',
];
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">About NaturalEvents</h1>
      <p class="mt-2 text-gray-600">
        A real-time earthquake and natural event monitoring dashboard. Track
        seismic activity worldwide and follow natural events like wildfires,
        storms, and volcanic eruptions as they unfold.
      </p>
    </div>

    <div class="rounded-lg bg-white p-6 shadow">
      <h2 class="mb-3 text-lg font-semibold text-gray-900">Data APIs</h2>
      <ul class="space-y-2 text-sm text-gray-600">
        <li>
          <a
            href="https://earthquake.usgs.gov/fdsnws/event/1/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-indigo-600 hover:underline"
          >
            USGS Earthquake API
          </a>
          &#8212; Real-time earthquake data from the U.S. Geological Survey,
          including magnitude, location, and depth.
        </li>
        <li>
          <a
            href="https://eonet.gsfc.nasa.gov/docs/v3"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-indigo-600 hover:underline"
          >
            NASA EONET v3
          </a>
          &#8212; Earth Observatory Natural Event Tracker. Tracks wildfires,
          severe storms, volcanoes, sea ice, and other natural events globally.
        </li>
      </ul>
    </div>

    <div class="rounded-lg bg-white p-6 shadow">
      <h2 class="mb-3 text-lg font-semibold text-gray-900">Tech Stack</h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tech in techStack"
          :key="tech"
          class="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
        >
          {{ tech }}
        </span>
      </div>
    </div>

    <div class="rounded-lg bg-white p-6 shadow">
      <h2 class="mb-3 text-lg font-semibold text-gray-900">Course</h2>
      <p class="text-sm text-gray-600">
        Built for the Frontend Frameworks course at Harbour.Space University.
        This project compares React and Vue by implementing the same application
        in both frameworks using a shared monorepo.
      </p>
    </div>
  </div>
</template>
