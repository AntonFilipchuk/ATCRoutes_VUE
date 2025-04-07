<template>
  <div>
    <canvas ref="pointsCanvas" :style="{ 'z-index': zIndex }"></canvas>
  </div>
</template>
<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore'
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute'
import { drawCanvasRoutePoints } from '@/utils/Modules/drawer'
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo'
import { computed, onMounted, ref, watch } from 'vue'

defineProps({
  zIndex: { type: Number, required: true },
})

const pointsCanvas = ref(null)
const canvasStore = computed(() => canvasDataStore())

const watchedProperties = [
  computed(() => canvasStore.value.width),
  computed(() => canvasStore.value.height),
  computed(() => canvasStore.value.activeRoute),
]

const watchedRoutesVisualProps = computed(() =>
  canvasStore.value.inactiveRoutes.map((route) => {
    return {
      ...route.routeVisuals.pointVisuals,
      ifShowPoints: route.routeVisuals.ifShowPoints,
      ifVisible: route.routeVisuals.ifVisible,
    }
  }),
)

watch([...watchedProperties, watchedRoutesVisualProps], () => {
  renderCanvas()
})

onMounted(() => {
  renderCanvas()
})

function renderCanvas() {
  try {
    const canvasContext = getCanvasInfo(pointsCanvas.value).canvasContext
    setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.width)
    const inactiveRoutes = canvasDataStore().inactiveRoutes.filter(
      (route) => route.routeVisuals.ifVisible && route.routeVisuals.ifShowPoints,
    )
    drawContent(canvasContext, inactiveRoutes)
  } catch (error) {
    console.error(error)
  }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: CanvasRoute[]) {
  routes.forEach((route) => {
    drawCanvasRoutePoints(route, canvasContext)
  })
}
</script>

<style scoped>
canvas {
  /* position: absolute; */
  left: 0;
  top: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
