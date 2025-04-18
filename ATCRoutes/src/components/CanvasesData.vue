<template>
  <div>
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

    <div :style="canvasContainerStyle">
      <GridCanvas :z-index="0" />
      <LinesCanvas :z-index="1" />
      <PointsCanvas :z-index="2" />
      <ActiveRouteCanvas :z-index="3" />
      <ConflictPointsCanvas :z-index="4" />
      <TextCanvas :z-index="5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type AIPRoute from '@/utils/Classes/AIPRoute/AIPRoute'
import GeographicCoordinate from '@/utils/Classes/GeographicCoordinate'
import { computed, onBeforeMount, watch, type CSSProperties } from 'vue'
import { coordinatesStore } from '@/stores/coordinatesStore'
import { AIPRoutesStore } from '@/stores/AIPRoutesStore'
import CanvasData from '@/utils/Classes/CanvasData'
import PointsCanvas from './Canvases/PointsCanvas.vue'
import { canvasDataStore } from '@/stores/canvasDataStore'
import LinesCanvas from './Canvases/LinesCanvas.vue'
import ActiveRouteCanvas from './Canvases/ActiveRouteCanvas.vue'
import GridCanvas from './Canvases/GridCanvas.vue'
import ConflictPointsCanvas from './Canvases/ConflictPointsCanvas.vue'
import TextCanvas from './Canvases/TextCanvas.vue'
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute'
import { canvasSizeStore } from '@/stores/canvasSizeStore'

const props = defineProps<{
  originPointName: string
  magneticDeviation: number
  useMagneticBearing: boolean
}>()

const width = canvasSizeStore().width
const canvasWidth = width
const canvasHeight = width

const coordinates = coordinatesStore().coordinates as GeographicCoordinate[]
const aipRoutes = AIPRoutesStore().routes as AIPRoute[]
const originCoordinate: GeographicCoordinate | undefined = coordinates.find((coordinate) => {
  return coordinate.name === props.originPointName
})

watch(canvasWidth, () => {
  updateCanvasData()
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

function updateCanvasData() {
  canvasDataStore().changeCanvasSize(canvasWidth.value, canvasHeight.value)
}
</script>

<style scoped></style>
