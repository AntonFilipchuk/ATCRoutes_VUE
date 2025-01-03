<template>
  <div>
    <canvas ref="conflictPointsCanvas" :style="{ 'z-index': zIndex }"></canvas>
  </div>
</template>
<script setup lang="ts">
import { canvasStore } from '@/stores/requests2/canvasStore'
import type IntersectionPoint from '@/utils/Classes/IntersectionPoint'
import { drawConflictPoint } from '@/utils/Modules/drawer'
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo'
import { ref, onMounted, computed, watch } from 'vue'

defineProps({
  zIndex: { type: Number, required: true },
})

const conflictPointsCanvas = ref(null)
const canvas = computed(() => canvasStore())
const watchedProperties = [
  computed(() => canvas.value.width),
  computed(() => canvas.value.height),
  computed(() => canvas.value.intersectionPoints),
]
let canvasContext: CanvasRenderingContext2D | undefined = undefined

watch(watchedProperties, () => {

  renderCanvas()
})

onMounted(() => {
  try {
    renderCanvas()
  } catch (error) {
    console.error(error)
  }
})

function renderCanvas() {
  canvasContext = getCanvasInfo(conflictPointsCanvas.value).canvasContext
  setCanvasDimensions(canvasContext, canvas.value.width, canvas.value.height)
  drawContent(canvasContext)
}

function drawContent(canvasContext: CanvasRenderingContext2D) {
  const selectedRoute = canvas.value.selectedRoute
  if (!selectedRoute) {
    return
  }
  const intersectionPoints: IntersectionPoint[] = canvas.value.intersectionPoints

  if (intersectionPoints.length > 0) {
    intersectionPoints.forEach((intersection) => {
      if (!intersection.edgeCaseMessage) {
        drawConflictPoint(
          { x: intersection.x, y: intersection.y },
          canvasStore().conflictPointVisuals,
          canvasContext,
        )
      }
    })
  }
}
</script>
<style lang=""></style>

<style scoped></style>
