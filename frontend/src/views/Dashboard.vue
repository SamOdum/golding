<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="w-full min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="px-4 w-full sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <div class="flex items-center">
            <span class="hidden mr-4 text-gray-600 md:block">Welcome, <span class="capitalize">{{ authStore.user?.firstName }}</span></span>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="px-4 py-6 w-full sm:px-6 lg:px-8">
      <div class="w-full">
        <div class="p-4 h-96 text-gray-600 rounded-lg border-2 border-indigo-300">
          <h2 class="mb-4 text-2xl font-bold">Protected Content</h2>
          <p>This content is only visible to authenticated users.</p>
        </div>
      </div>
    </main>
  </div>
</template>