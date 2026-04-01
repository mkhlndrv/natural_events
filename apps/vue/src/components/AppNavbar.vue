<script setup lang="ts">
import { RouterLink } from 'vue-router';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/about', label: 'About' },
];
</script>

<template>
  <nav aria-label="Main navigation" class="border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <span class="text-xl font-bold tracking-tight text-indigo-600"
          >NaturalEvents</span
        >
        <div class="flex space-x-1">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900"
            exact-active-class="bg-indigo-50 !text-indigo-700"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
