<template>
  <div><canvas ref="linesCanvas" :style="{ 'z-index': zIndex }"></canvas></div>
</template>
<script setup lang="ts">
import { canvasStore } from '@/stores/requests2/canvasStore'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import { drawLines } from '@/utils/Modules/drawer'
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo'
import { computed, onMounted, ref, watch } from 'vue'

defineProps({
  zIndex: { type: Number, required: true },
})

const canvas = computed(() => canvasStore())
const linesCanvas = ref(null)

const watchedProperties = [
  // computed(() => canvasStore.value.width),
  // computed(() => canvasStore.value.height),
  computed(() => canvasStore().selectedRoute),
]

// const watchedRoutesVisualProps = computed(() => canvasStore.value.inactiveRoutes.map((route) => {
//     return { ...route.routeVisuals.lineVisuals, ifShowLines: route.routeVisuals.ifShowLines, ifVisible: route.routeVisuals.ifVisible }
// }))

watch(watchedProperties, () => {
  renderCanvas()
})

onMounted(() => {
  renderCanvas()
})

function renderCanvas() {
  try {
    const canvasContext = getCanvasInfo(linesCanvas.value).canvasContext
    setCanvasDimensions(canvasContext, canvas.value.width, canvas.value.height)
    const routes = canvas.value.getRoutes()
    drawContent(canvasContext, routes)
  } catch (error) {
    console.error(error)
  }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: ICanvasRoute[]) {
  routes.forEach((route) => {
    drawLines(route, route.visuals, canvasContext)
  })
}
</script>
<style scoped>
</style>
