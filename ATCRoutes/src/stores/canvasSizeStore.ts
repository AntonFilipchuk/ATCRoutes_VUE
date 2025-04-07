import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const canvasSizeStore = defineStore('canvasSizeStore', () => {
  const width_ = ref(window.innerWidth / 2)

  const width = computed({
    get: () => {
      return width_
    },
    set: () => {
      return
    },
  })

  const increaseCanvasWidth = () => {
    if (width_.value < window.innerWidth) {
      width_.value += 200
      if (width_.value >= window.innerWidth) return window.innerWidth
      return width_.value
    }
    return width_.value
  }

  const decreaseCanvasWidth = () => {
    if (width_.value > window.innerWidth / 4) {
      width_.value -= 200
      if (width_.value <= window.innerWidth / 4) return window.innerWidth / 4
      return width_.value
    }
    return width_.value
  }

  const maxCanvasWidth = () => {
    width_.value = window.innerWidth
    return width_.value
  }

  const minCanvasWidth = () => {
    width_.value = window.innerWidth / 4
    return width_.value
  }

  return { width, increaseCanvasWidth, decreaseCanvasWidth, minCanvasWidth, maxCanvasWidth }
})
