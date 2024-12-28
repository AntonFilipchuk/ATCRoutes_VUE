<template>
  <div><canvas ref="linesCanvas"></canvas></div>
</template>
<script setup lang="ts">
import { canvasRoutesStore } from '@/stores/requests2/canvasRoutesStore'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import { drawCanvasLines_ } from '@/utils/Modules/drawer'
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo'
import { computed, onMounted, ref, watch } from 'vue'

const canvasStore = computed(() => canvasRoutesStore())
const linesCanvas = ref(null)

const watchedProperties = [
  // computed(() => canvasStore.value.width),
  // computed(() => canvasStore.value.height),
  computed(() => canvasRoutesStore().activeRoute),
]

// const watchedRoutesVisualProps = computed(() => canvasStore.value.inactiveRoutes.map((route) => {
//     return { ...route.routeVisuals.lineVisuals, ifShowLines: route.routeVisuals.ifShowLines, ifVisible: route.routeVisuals.ifVisible }
// }))

watch(watchedProperties, () => {
  console.log('Active route changed!')

  renderCanvas()
})

onMounted(() => {
  renderCanvas()
})

function renderCanvas() {
  try {
    const canvasContext = getCanvasInfo(linesCanvas.value).canvasContext
    setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height)
    const standardRoutes = canvasStore.value.standardRoutes
    const customRoutes = canvasStore.value.customRoutes

    const routes = standardRoutes.concat(customRoutes).flatMap((a) => a.SIDs.concat(a.STARs))

    drawContent(canvasContext, routes)
  } catch (error) {
    console.error(error)
  }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: ICanvasRoute[]) {
  routes.forEach((route) => {
    drawCanvasLines_(route, canvasContext)
  })
}
</script>
<style scoped>
canvas {
  z-index: 0;
}
</style>
