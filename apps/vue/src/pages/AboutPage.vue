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
  <div class="space-y-10 fade-in">
    <div>
      <h1
        class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent"
      >
        About NaturalEvents
      </h1>
      <p
        class="mt-4 text-lg text-slate-400 font-medium max-w-3xl leading-relaxed"
      >
        A real-time earthquake and natural event monitoring dashboard. Track
        seismic activity worldwide and follow natural events like wildfires,
        storms, and volcanic eruptions as they unfold.
      </p>
    </div>

    <div
      class="rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md"
    >
      <h2
        class="mb-6 text-xl font-bold text-slate-200 border-b border-white/5 pb-3"
      >
        Data APIs
      </h2>
      <ul class="space-y-4 text-sm text-slate-300">
        <li class="flex items-start gap-3">
          <span
            class="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
          ></span>
          <div>
            <a
              href="https://earthquake.usgs.gov/fdsnws/event/1/"
              target="_blank"
              rel="noopener noreferrer"
              class="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
              USGS Earthquake API
            </a>
            <p class="mt-1 text-slate-400">
              Real-time earthquake data from the U.S. Geological Survey,
              including magnitude, location, and depth.
            </p>
          </div>
        </li>
        <li class="flex items-start gap-3">
          <span
            class="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
          ></span>
          <div>
            <a
              href="https://eonet.gsfc.nasa.gov/docs/v3"
              target="_blank"
              rel="noopener noreferrer"
              class="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
              NASA EONET v3
            </a>
            <p class="mt-1 text-slate-400">
              Earth Observatory Natural Event Tracker. Tracks wildfires, severe
              storms, volcanoes, sea ice, and other natural events globally.
            </p>
          </div>
        </li>
      </ul>
    </div>

    <div
      class="rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md"
    >
      <h2
        class="mb-6 text-xl font-bold text-slate-200 border-b border-white/5 pb-3"
      >
        Tech Stack
      </h2>
      <div class="flex flex-wrap gap-3">
        <span
          v-for="tech in techStack"
          :key="tech"
          class="rounded-lg bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-default"
        >
          {{ tech }}
        </span>
      </div>
    </div>

    <div
      class="rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md"
    >
      <h2
        class="mb-6 text-xl font-bold text-slate-200 border-b border-white/5 pb-3"
      >
        Course
      </h2>
      <p class="text-base text-slate-300 font-medium leading-relaxed">
        Built for the Frontend Frameworks course at Harbour.Space University.
        This project compares React and Vue by implementing the same application
        in both frameworks using a shared monorepo.
      </p>
    </div>
  </div>
</template>
