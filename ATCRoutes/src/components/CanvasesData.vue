<template>
  <div>
    <div style="display: flex; flex-direction: row; align-items: baseline; gap: 10px">
      <div style="width: 350px">
        <h1>Size: {{ canvasWidth }}px by {{ canvasHeight }}px</h1>
      </div>
      <div style="display: flex; flex-direction: row; gap: 5px">
        <button @click="increaseCanvasSize" style="font-size: 32px; width: 60px; height: 60px">
          +
        </button>
        <button @click="decreaseCanvasSize" style="font-size: 32px; width: 60px; height: 60px">
          -
        </button>
      </div>
    </div>
    <div style="display: flex; flex-direction: row; align-items: baseline; gap: 10px">
      <div>
        <h1>Selected route:</h1>
      </div>
      <div>
        <select style="font-size: 32px" v-model="activeRoute">
          <option v-for="(route, index) in routes" :key="index" :value="route">
            {{ route.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
  <div style="display: flex; flex-direction: row; align-items: stretch; gap: 5px">
    <div :style="canvasContainerStyle">
      <GridCanvas :z-index="0" />
      <LinesCanvas :z-index="1" />
      <PointsCanvas :z-index="2" />
      <ActiveRouteCanvas :z-index="3" />
      <ConflictPointsCanvas :z-index="4" />
      <TextCanvas :z-index="5" />
    </div>
    <div style="display: flex; flex: 1; position: relative">
      <DataTypeDisplaySelector />
    </div>
  </div>
</template>

<script setup lang="ts">
import type AIPRoute from '@/utils/Classes/AIPRoute/AIPRoute'
import GeographicCoordinate from '@/utils/Classes/GeographicCoordinate'
import { computed, onBeforeMount, ref, type CSSProperties, type Ref } from 'vue'
import { coordinatesStore } from '@/stores/requests/coordinatesStore'
import { AIPRoutesStore } from '@/stores/requests/AIPRoutesStore'
import CanvasData from '@/utils/Classes/CanvasData'
import PointsCanvas from './Canvases/PointsCanvas.vue'
import { canvasDataStore } from '@/stores/internal/canvasDataStore'
import LinesCanvas from './Canvases/LinesCanvas.vue'
import ActiveRouteCanvas from './Canvases/ActiveRouteCanvas.vue'
import GridCanvas from './Canvases/GridCanvas.vue'
import ConflictPointsCanvas from './Canvases/ConflictPointsCanvas.vue'
import TextCanvas from './Canvases/TextCanvas.vue'
import DataTypeDisplaySelector from './DataTypeDisplaySelector.vue'
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute'

const props = defineProps<{
  originPointName: string
  magneticDeviation: number
  useMagneticBearing: boolean
}>()

const canvasWidth: Ref<number> = ref(800)
const canvasHeight: Ref<number> = ref(800)

const coordinates = coordinatesStore().coordinates as GeographicCoordinate[]
const aipRoutes = AIPRoutesStore().routes as AIPRoute[]
const originCoordinate: GeographicCoordinate | undefined = coordinates.find((coordinate) => {
  return coordinate.name === props.originPointName
})

const routes = computed(() => canvasDataStore().allRoutes)

const activeRoute = computed({
  get() {
    return canvasDataStore().activeRoute
  },
  set(route: CanvasRoute) {
    canvasDataStore().setActiveRoute(route)
  },
})

onBeforeMount(() => {
  if (!originCoordinate) {
    throw new Error("Can't find origin coordinate in coordinates list!")
  }
  canvasDataStore().setCanvasData(
    new CanvasData(
      canvasWidth.value,
      canvasHeight.value,
      originCoordinate,
      coordinates,
      aipRoutes,
      -11,
    ),
  )
})

const canvasContainerStyle = computed(
  (): CSSProperties => ({
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`,
    position: `relative`,
  }),
)

const increaseCanvasSize = () => {
  canvasWidth.value += 200
  canvasHeight.value += 200
  updateCanvasData()
}

const decreaseCanvasSize = () => {
  canvasWidth.value -= 200
  canvasHeight.value -= 200
  updateCanvasData()
}

function updateCanvasData() {
  canvasDataStore().changeCanvasSize(canvasWidth.value, canvasHeight.value)
}
</script>

<style scoped></style>
