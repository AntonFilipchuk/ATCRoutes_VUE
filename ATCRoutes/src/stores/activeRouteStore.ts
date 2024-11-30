import type Route from '@/utils/Classes/Route/Route'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const activeRouteStore = defineStore('activeRouteStore', () => {
  const activeRoute = ref<Route | null>(null)
  const getActiveRoute = computed(() => activeRoute)
  return { activeRoute, getActiveRoute }
})
