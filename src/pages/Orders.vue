<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <section class="prose dark:prose-invert max-w-none">
    <h2>Orders</h2>
    <p v-if="auth.can('orders:read')">Orders content...</p>
    <p v-else>You do not have permission to view orders.</p>
  </section>
</template>
