<template>
  <div class="min-h-dvh flex bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100">
    <SideNav v-model:expanded="expanded" :items="items" />

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-14 border-b-2 border-red-500 flex items-center px-3 gap-2">
        <h1 class="font-semibold tracking-tight">App</h1>
        <div class="ml-auto text-sm opacity-80">Signed in as {{ auth.user.name }}</div>
      </header>

      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import SideNav from '@/components/SideNav.vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const auth = useAuthStore()
const ui = useUiStore()

const expanded = computed({
  get: () => !ui.navCollapsed,
  set: (v: boolean) => ui.setNavCollapsed(!v)
})

const items = computed(() => [
  { text: 'Dashboard', to: '/', icon: 'home', perm: 'dashboard:view' },
  { text: 'Requests', to: '/requests', icon: 'inbox', perm: 'orders:read' },
  { text: 'Orders', to: '/orders', icon: 'shopping-cart', perm: 'orders:read' },
  { text: 'Payments', to: '/payments', icon: 'credit-card', perm: 'reports:view' },
  { text: 'Reports', to: '/reports', icon: 'document-chart-bar', perm: 'reports:view' },
  {
    text: 'Settings', icon: 'cog-6-tooth', id: 'grp-settings', perm: 'settings:view',
    children: [
      { text: 'Profile', to: '/settings/profile', perm: 'settings:view' },
      { text: 'Billing', to: '/settings/billing', perm: 'settings:view' }
    ]
  }
])
</script>