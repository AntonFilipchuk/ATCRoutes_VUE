import type IAerodrome from '@/utils/Interfaces/IAerodrome'
import type IRouteVisuals from '@/utils/Interfaces/Visuals/IRouteVisuals'
import type IVisual from '@/utils/Interfaces/Visuals/IVisual'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const fetchedDataStore = defineStore('fetchedDataStore', () => {
  const standardRoutes = ref<IAerodrome[]>([])
  const customRoutes = ref<IAerodrome[]>([])
  const selectedRouteVisual = ref<IRouteVisuals | undefined>(undefined)
  const conflictPointVisual = ref<IVisual | undefined>(undefined)
  const loadingStandardRoutes = ref(true)
  const loadingCustomRoutes = ref(true)
  const loadingSelectedRouteVisuals = ref(true)
  const loadingConflictPointVisuals = ref(true)
  const errorMessage = ref<string[]>([])

  async function fetchStandardRoutes(api: string) {
    try {
      const response = await fetch(api)

      if (!response.ok) {
        throw new Error('Failed to fetch standard routes data!')
      }

      const result = await response.json()

      if (!result.aerodromes || result.aerodromes.length === 0) {
        throw new Error('Aerodromes list for standard routes does not exits or empty!')
      }

      standardRoutes.value = result.aerodromes as IAerodrome[]
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value.push(error.message)
      } else {
        errorMessage.value.push('Something bad happened fetching standard routes. ')
      }
    } finally {
      loadingStandardRoutes.value = false
    }
  }

  async function fetchCustomRoutes(api: string) {
    try {
      const response = await fetch(api)

      if (!response.ok) {
        throw new Error('Failed to fetch custom routes data!')
      }

      const result = await response.json()

      if (!result.aerodromes || result.aerodromes.length === 0) {
        throw new Error('Aerodromes list for custom routes does not exits or empty!')
      }

      customRoutes.value = result.aerodromes as IAerodrome[]
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value.push(error.message)
      } else {
        errorMessage.value.push('Something bad happened fetching custom routes. ')
      }
    } finally {
      loadingCustomRoutes.value = false
    }
  }

  async function fetchSelectedRouteVisuals(api: string) {
    try {
      const response = await fetch(api)

      if (!response.ok) {
        throw new Error('Failed to fetch selected route visuals data!')
      }

      const result = await response.json()

      if (!result.selectedRoute) {
        throw new Error('Visuals do not exist for selected route!')
      }

      selectedRouteVisual.value = result.selectedRoute as IRouteVisuals
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value.push(error.message)
      } else {
        errorMessage.value.push('Something bad happened fetching selected route visuals. ')
      }
    } finally {
      loadingSelectedRouteVisuals.value = false
    }
  }

  async function fetchConflictPointVisuals(api: string) {
    try {
      const response = await fetch(api)

      if (!response.ok) {
        throw new Error('Failed to fetch conflict point visuals data!')
      }

      const result = await response.json()

      if (!result.conflictPoint.pointVisuals) {
        throw new Error('Visuals do not exist for conflict point!')
      }

      conflictPointVisual.value = result.conflictPoint.pointVisuals as IVisual
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value.push(error.message)
      } else {
        errorMessage.value.push('Something bad happened fetching conflict point visuals. ')
      }
    } finally {
      loadingConflictPointVisuals.value = false
    }
  }

  return {
    standardRoutes,
    customRoutes,
    selectedRouteVisual,
    conflictPointVisual,
    loadingSelectedRouteVisuals,
    loadingConflictPointVisuals,
    loadingCustomRoutes,
    loadingStandardRoutes,
    errorMessage,
    fetchSelectedRouteVisuals,
    fetchConflictPointVisuals,
    fetchStandardRoutes,
    fetchCustomRoutes,
  }
})
