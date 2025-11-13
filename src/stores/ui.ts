import { defineStore } from 'pinia'

const KEY = 'ui.navCollapsed'

export const useUiStore = defineStore('ui', {
  state: () => ({
    navCollapsed: ((): boolean => {
      try { return JSON.parse(localStorage.getItem(KEY) || 'false') } catch { return false }
    })()
  }),
  actions: {
    setNavCollapsed(v: boolean) {
      this.navCollapsed = v
      try { localStorage.setItem(KEY, JSON.stringify(v)) } catch {}
    },
    toggleNav() {
      this.setNavCollapsed(!this.navCollapsed)
    }
  }
})
