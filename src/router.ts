import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from './stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./pages/Home.vue'), meta: { label: 'Home', icon: 'home', perm: 'dashboard:view' } },
  { path: '/orders', name: 'orders', component: () => import('./pages/Orders.vue'), meta: { label: 'Orders', icon: 'shopping-bag', perm: 'orders:read' } },
  { path: '/reports', name: 'reports', component: () => import('./pages/Reports.vue'), meta: { label: 'Reports', icon: 'chart-bar', perm: 'reports:view' } },
  {
    path: '/settings',
    component: () => import('./pages/settings/Index.vue'),
    meta: { label: 'Settings', icon: 'cog-6-tooth', perm: 'settings:view' },
    children: [
      { path: 'profile', name: 'settings-profile', component: () => import('./pages/settings/Profile.vue'), meta: { label: 'Profile', perm: 'settings:view' } },
      { path: 'billing', name: 'settings-billing', component: () => import('./pages/settings/Billing.vue'), meta: { label: 'Billing', perm: 'settings:view' } },
    ]
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global guard: block routes if permission missing
router.beforeEach((to) => {
  const auth = useAuthStore()
  const perm = to.meta?.perm as string | undefined
  if (perm && !auth.can(perm)) {
    return { name: 'home' }
  }
})
