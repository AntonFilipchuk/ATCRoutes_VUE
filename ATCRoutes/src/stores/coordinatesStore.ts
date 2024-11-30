import GeographicCoordinate from '@/utils/Classes/GeographicCoordinate'
import fetchData from '@/utils/Modules/fetch'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const coordinatesStore = defineStore('coordinatesStore', () => {
  const coordinates = ref<GeographicCoordinate[]>([])
  const loading = ref(true)
  const errorMessage = ref<string | null>(null)

  async function fetchCoordinates(path: string) {
    try {
      const result = await fetchData(path)

      if (result && !result.errorMessage) {
        const coors: { name: string; latitude: string; longitude: string }[] = result.coordinates
        if (!coors || coors.length === 0) {
          throw new Error('Coordinates are empty!')
        }
        coordinates.value = coors.map(
          (coordinate) =>
            new GeographicCoordinate(coordinate.name, coordinate.latitude, coordinate.longitude),
        )
        loading.value = false
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = 'Something bad happened fetching coordinates'
      }
    }
  }

  return { coordinates, loading, errorMessage, fetchCoordinates }
})
