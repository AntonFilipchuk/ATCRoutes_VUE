<template>
  <div><canvas ref="pointsCanvas"></canvas></div>
</template>
<script setup lang="ts">
import { canvasRoutesStore } from '@/stores/requests2/canvasRoutesStore'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import { drawCanvasRoutePoints_ } from '@/utils/Modules/drawer'
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo'
import { computed, onMounted, ref } from 'vue'

const canvasStore = computed(() => canvasRoutesStore())
const pointsCanvas = ref(null)
onMounted(() => {
  renderCanvas()
})

function renderCanvas() {
  try {
    const canvasContext = getCanvasInfo(pointsCanvas.value).canvasContext
    setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height)
    const routes = [
      ...canvasStore.value.standardRoutes.SIDs,
      ...canvasStore.value.standardRoutes.STARs,
      ...canvasStore.value.customRoutes.SIDs,
      ...canvasStore.value.customRoutes.STARs,
    ]
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
