<script setup lang="ts">
import AppNavbar from './AppNavbar.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50/50">
    <AppNavbar />
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>
