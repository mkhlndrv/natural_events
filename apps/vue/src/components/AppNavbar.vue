<script setup lang="ts">
import { RouterLink } from 'vue-router';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/about', label: 'About' },
];
</script>

<template>
  <nav
    aria-label="Main navigation"
    class="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <span
          class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent"
          >NaturalEvents</span
        >
        <div class="flex space-x-1">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-300 hover:text-slate-100"
            exact-active-class="bg-indigo-500/10 !text-indigo-300 ring-1 ring-inset ring-indigo-500/20"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
