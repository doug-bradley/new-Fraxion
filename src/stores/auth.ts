import { defineStore } from 'pinia'

export type Role = 'admin' | 'manager' | 'user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: 'u1',
      name: 'Doug',
      roles: ['manager'] as Role[],
      permissions: new Set<string>([
        'dashboard:view',
        'orders:read',
        'reports:view',
        'settings:view',
        'settings.profile:edit'
      ])
    }
  }),
  getters: {
    can: (state) => (perm: string) => state.user.permissions.has(perm),
    hasRole: (state) => (role: Role) => state.user.roles.includes(role)
  },
  actions: {
    setPermissions(perms: string[]) {
      this.user.permissions = new Set(perms)
    },
    setRoles(roles: Role[]) {
      this.user.roles = roles
    }
  }
})
