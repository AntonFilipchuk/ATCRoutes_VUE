import type AIPRoute from '@/utils/Classes/AIPRoute/AIPRoute'
import fetchData from '@/utils/Modules/fetch'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const AIPRoutesStore = defineStore('APIRoutesStore', () => {
  const routes = ref<AIPRoute[]>([])
  const loading = ref(true)
  const errorMessage = ref<string | null>(null)

  async function fetchRoutes(path: string) {
    try {
      const result = await fetchData(path)

      if (result && !result.errorMessage) {
        if (!result.routes || result.routes.length === 0) {
          throw new Error('Routes are empty!')
        }
        routes.value = result.routes
        loading.value = false
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = 'Something bad happened fetching routes'
      }
    }
  }

  return { routes, loading, errorMessage, fetchRoutes }
})

