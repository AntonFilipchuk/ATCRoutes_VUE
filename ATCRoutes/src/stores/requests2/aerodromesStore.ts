import type IAerodrome from '@/utils/Interfaces/IAerodrome'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const aerodromesStore = defineStore('aerodromesStore', () => {
  const aerodromes = ref<IAerodrome[]>([])
  const loading = ref(true)
  const errorMessage = ref<string | null>(null)

  async function fetchAerodromes(api: string) {
    try {
      const response = await fetch(api)

      if (!response.ok) {
        throw new Error('Failed to fetch aerodromes data!')
      }

      const result = await response.json()

      if (!result.aerodromes || result.aerodromes.length === 0) {
        throw new Error('Aerodromes list does not exits or empty!')
      }

      aerodromes.value = result.aerodromes as IAerodrome[]
      errorMessage.value = null
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = 'Something bad happened fetching routes'
      }
    } finally {
      loading.value = false
    }
  }

  return { aerodromes, loading, errorMessage, fetchAerodromes }
})
