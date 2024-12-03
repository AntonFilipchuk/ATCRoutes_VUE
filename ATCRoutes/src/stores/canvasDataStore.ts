import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type CanvasData from '@/utils/Classes/CanvasData'

export const canvasDataStore = defineStore('canvasDataStore', () => {
  const canvasData: Ref<CanvasData | null> = ref(null)
  return { canvasData }
})
