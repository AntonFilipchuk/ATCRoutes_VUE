import Canvas_Data from '@/utils/Classes/Canvas_Data'
import type IAerodrome from '@/utils/Interfaces/IAerodrome'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export const canvasRoutesStore = defineStore('canvasRoutesStore', () => {
  const canvasData: Ref<Canvas_Data | undefined> = ref(undefined)

  function ensureCanvasData(): Canvas_Data {
    if (!canvasData.value) {
      throw new Error('No CanvasData!')
    }
    return canvasData.value
  }

  function createCanvasData(
    width: number,
    height: number,
    deviation: number,
    aerodromes: IAerodrome[],
  ) {
    canvasData.value = new Canvas_Data(width, height, deviation, aerodromes)
  }

  const STARs = computed(() => {
    return ensureCanvasData().STARs
  })

  return { STARs, createCanvasData }
})
