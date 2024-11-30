import type IntersectionPoint from '@/utils/Classes/IntersectionPoint'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const intersectionsStore = defineStore('intersectionsStore', () => {
  const intersections = ref<IntersectionPoint[]>([])
  return { intersections }
})
