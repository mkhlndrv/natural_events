<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id;
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Event Detail</h1>
    <p class="mt-2 text-gray-600">Showing details for event: {{ id }}</p>
  </div>
</template>
