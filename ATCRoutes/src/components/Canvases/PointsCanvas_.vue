<template>
  <div><canvas ref="pointsCanvas"></canvas></div>
</template>
<script setup lang="ts">
import { canvasStore } from '@/stores/requests2/canvasStore'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import { drawCanvasRoutePoints_ } from '@/utils/Modules/drawer'
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo'
import { computed, onMounted, ref, watch } from 'vue'

const canvas = computed(() => canvasStore())
const pointsCanvas = ref(null)

const watchedProperties = [
  // computed(() => canvasStore.value.width),
  // computed(() => canvasStore.value.height),
  computed(() => canvasStore().selectedRoute),
]

watch(watchedProperties, () => {
  renderCanvas()
})


onMounted(() => {
  renderCanvas()
})

function renderCanvas() {
  try {
    const canvasContext = getCanvasInfo(pointsCanvas.value).canvasContext
    setCanvasDimensions(canvasContext, canvas.value.width, canvas.value.height)
    const routes = canvas.value.getRoutes()
    console.log("routes", routes);
    
    drawContent(canvasContext, routes)
  } catch (error) {
    console.error(error)
  }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: ICanvasRoute[]) {
  routes.forEach((route) => {
    drawCanvasRoutePoints_(route, canvasContext)
  })
}
</script>
<style scoped>
canvas {
  z-index: 1;
}
</style>
