<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.checkAuth();
});
</script>

<template>
  <router-view />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>