import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const visualSettingsStore = defineStore('visualSettingsStore', () => {
  const lineWidthChange_ = ref(0)
  const lineWidthChange = computed({
    get: () => {
      return lineWidthChange_
    },
    set: (val: number) => {
      lineWidthChange_.value = val
    },
  })
  const pointsWidthChange_ = ref(0)
  const pointsWidthChange = computed({
    get: () => {
      return pointsWidthChange_
    },
    set: (val: number) => {
      pointsWidthChange_.value = val
    },
  })
  const textSizeChange_ = ref(0)
  const textSizeChange = computed({
    get: () => {
      return textSizeChange_
    },
    set: (val: number) => {
      textSizeChange_.value = val
    },
  })

  const ifShowText_ = ref(true)
  const ifShowText = computed({
    get: () => {
      return ifShowText_
    },
    set: (val: boolean) => {
      ifShowText_.value = val
    },
  })

  const ifShowPoints_ = ref(true)
  const ifShowPoints = computed({
    get: () => {
      return ifShowPoints_
    },
    set: (val: boolean) => {
      ifShowPoints_.value = val
    },
  })

  const ifShowLines_ = ref(true)
  const ifShowLines = computed({
    get: () => {
      return ifShowLines_
    },
    set: (val: boolean) => {
      ifShowLines_.value = val
    },
  })

  return {
    ifShowLines,
    ifShowPoints,
    ifShowText,
    lineWidthChange,
    textSizeChange,
    pointsWidthChange,
  }
})
