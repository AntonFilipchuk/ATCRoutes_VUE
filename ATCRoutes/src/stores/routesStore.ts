import Route from '@/utils/Classes/Route/Route'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const routesStore = defineStore('routesStore', () => {
  const routes = ref<Route[]>([])
  return { routes }
})

