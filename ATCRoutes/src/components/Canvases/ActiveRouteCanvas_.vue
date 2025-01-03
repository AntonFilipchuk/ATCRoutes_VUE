<template>
  <div>
    <canvas ref="activeRouteCanvas" @mousedown="clickPoint" :style="{ 'z-index': zIndex }"></canvas>
  </div>
</template>

<script setup lang="ts">
import { canvasStore } from '@/stores/requests2/canvasStore'
import type CanvasPoint from '@/utils/Interfaces/CanvasRoute/CanvasPoint'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import { cleanCanvas, drawLines, drawPoints, drawRouteText } from '@/utils/Modules/drawer'
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo'
import { computed, onMounted, onUnmounted, ref, watch, type Ref, type WatchHandle } from 'vue'

defineProps({
  zIndex: { type: Number, required: true },
})

let canvasContext: CanvasRenderingContext2D | undefined = undefined
let selectedPoint: CanvasPoint | undefined | null = undefined

const activeRouteCanvas: Ref<HTMLCanvasElement | null> = ref(null)
const canvas = computed(() => canvasStore())

const selectedRouteVisuals = computed(() => {
  if (!canvas.value.selectedRoute) {
    return
  }

  return canvas.value.selectedRouteVisuals
})

const watchedProperties = [
  computed(() => canvas.value.width),
  computed(() => canvas.value.height),
  selectedRouteVisuals,
]

watch(watchedProperties, () => {
  renderCanvas()
})

let pointWatchers: WatchHandle[] = []
watch(
  computed<ICanvasRoute | null>(() => canvas.value.selectedRoute),
  (newActiveRoute) => {
    pointWatchers.forEach((unwatch) => unwatch())
    if (!newActiveRoute) {
      return
    }

    // Set up new watchers
    pointWatchers = newActiveRoute.points.map((point) =>
      watch(
        () => [point.x, point.y],
        () => {
          renderCanvas()
        },
      ),
    )
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('mousedown', resetSelectedPointIfClickOutsideCanvas)

  try {
    renderCanvas()
  } catch (error) {
    console.error(error)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', resetSelectedPointIfClickOutsideCanvas)
})

function resetSelectedPointIfClickOutsideCanvas(event: MouseEvent) {
  if (!activeRouteCanvas.value) {
    return
  }

  const target = event.target as HTMLElement

  if (!target) {
    return
  }

  if (selectedPoint) {
    if (activeRouteCanvas.value.id !== target.id) {
      selectedPoint = null
    }
  }
}

function renderCanvas() {
  canvasContext = getCanvasInfo(activeRouteCanvas.value).canvasContext
  setCanvasDimensions(canvasContext, canvas.value.width, canvas.value.height)

  drawContent(canvasContext)
}

function drawContent(canvasContext: CanvasRenderingContext2D) {
  const route = canvas.value.selectedRoute
  if (route && selectedRouteVisuals.value!.ifVisible) {
    if (route.visuals.ifShowLines) {
      drawLines(route, selectedRouteVisuals.value!, canvasContext)
    }
    if (route.visuals.ifShowPoints) {
      drawPoints(route, selectedRouteVisuals.value!, canvasContext)
    }
    if (route.visuals.ifShowText) {
      drawRouteText(route, selectedRouteVisuals.value!, canvasContext)
    }
  }
}

function clickPoint(event: MouseEvent) {
  const route = canvas.value.selectedRoute

  if (!canvasContext) {
    throw new Error('No active route or canvas context available.')
  }

  if (!route) {
    return
  }

  const x = event.offsetX
  const y = event.offsetY

  if (!selectedPoint) {
    const pointAsPath2D =
      route.routePointsAsPath2d.find((point) => {
        return (
          canvasContext!.isPointInPath(point.path2d, x, y) ||
          canvasContext!.isPointInStroke(point.path2d, x, y)
        )
      }) || null

    if (pointAsPath2D) {
      selectedPoint = route.points.find((point) => point.name === pointAsPath2D.name)
      if (!selectedPoint) {
        throw new Error(
          "Can't find a corresponding point in route from points as Path2D. Impossible!",
        )
      }
    } else {
      selectedPoint = null
    }
  } else {
    canvas.value.updatePoint(selectedPoint, x, y)
    //canvas.value.makeStandardRouteCustom(canvas.value.selectedRoute)
    cleanCanvas(canvasContext)
    //No need to call drawContent again because
    //The route will be drawn because watchers will detect change in coordinates
    selectedPoint = null
  }
}
</script>

<style scoped>
canvas {
  pointer-events: auto;
}
</style>
