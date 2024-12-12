import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const visualSettingsStore = defineStore('visualSettingsStore', () => {
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
        ifShowLines_ .value = val
    },
  })

  return { ifShowLines, ifShowPoints, ifShowText }
})
