<template>
  <div>
    <h1>Size: {{ width }}px by {{ width }}px</h1>

    <div style="display: flex; flex-direction: row; gap: 5px">
      <button @click="decreaseCanvasSize" style="font-size: 32px; width: 60px; height: 60px">
        -
      </button>
      <button @click="increaseCanvasSize" style="font-size: 32px; width: 60px; height: 60px">
        +
      </button>

      <button @click="minCanvasSize" style="font-size: 32px; width: 80px; height: 60px">min</button>
      <button @click="maxCanvasSize" style="font-size: 32px; width: 80px; height: 60px">max</button>
    </div>
  </div>

  <div style="display: flex; flex-wrap: wrap">
    <CanvasesData
      :magnetic-deviation="props.magneticDeviation"
      :use-magnetic-bearing="props.useMagneticBearing"
      :origin-point-name="props.originPointName"
    />

    <DataTypeDisplaySelector />
  </div>
</template>

<script setup lang="ts">
import CanvasesData from './CanvasesData.vue'
import { canvasSizeStore } from '@/stores/canvasSizeStore'
import DataTypeDisplaySelector from './DataTypeDisplaySelector.vue'

const props = defineProps<{
  originPointName: string
  magneticDeviation: number
  useMagneticBearing: boolean
}>()

const width = canvasSizeStore().width

const increaseCanvasSize = () => {
  canvasSizeStore().increaseCanvasWidth()
}

const decreaseCanvasSize = () => {
  canvasSizeStore().decreaseCanvasWidth()
}

const minCanvasSize = () => {
  canvasSizeStore().minCanvasWidth()
}

const maxCanvasSize = () => {
  canvasSizeStore().maxCanvasWidth()
}
</script>
