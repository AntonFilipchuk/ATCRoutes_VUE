<template>
  <div>
    <canvas ref="textCanvas" :style="{ 'z-index': zIndex }"></canvas>
  </div>
</template>

<script setup lang="ts">
import { canvasStore } from '@/stores/requests2/canvasStore'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import { drawRouteText } from '@/utils/Modules/drawer'
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo'
import { computed, onMounted, ref, watch } from 'vue'

defineProps({
  zIndex: { type: Number, required: true },
})

const textCanvas = ref(null)
const canvas = computed(() => canvasStore())

onMounted(() => {
  renderCanvas()
})

const watchedRoutesVisualProps = computed(() =>
  canvas.value.getRoutes().map((route) => {
    return {
      ifVisible: route.visuals.ifVisible,
      ifShowText: route.visuals.ifShowText,
      ...route.visuals.textVisuals,
    }
  }),
)

watch(
  [
    computed<number>(() => canvas.value.width),
    computed<number>(() => canvas.value.height),
    watchedRoutesVisualProps,
  ],
  () => {
    renderCanvas()
  },
)

function renderCanvas() {
  try {
    const canvasContext = getCanvasInfo(textCanvas.value).canvasContext
    setCanvasDimensions(canvasContext, canvas.value.width, canvas.value.height)
    const routes = canvas.value
      .getRoutes()
      .filter((route) => route.visuals.ifVisible && route.visuals.ifShowText)
    drawContent(canvasContext, routes)
  } catch (error) {
    console.error(error)
  }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: ICanvasRoute[]) {
  routes.forEach((route) => {
    drawRouteText(route, route.visuals, canvasContext)
  })
}
</script>

<style scoped>
</style>
