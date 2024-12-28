<template>
  <div>
    <canvas ref="canvas" @mousedown="clickPoint"></canvas>
  </div>
</template>

<script setup lang="ts">
import { canvasRoutesStore } from '@/stores/requests2/canvasRoutesStore'
import type CanvasPoint from '@/utils/Interfaces/CanvasRoute/CanvasPoint'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import type IRouteVisuals from '@/utils/Interfaces/Visuals/IRouteVisuals'
import { cleanCanvas, drawCanvasLines_, drawCanvasRoutePoints_ } from '@/utils/Modules/drawer'
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo'
import { computed, onMounted, onUnmounted, ref, watch, type Ref, type WatchHandle } from 'vue'

let canvasContext: CanvasRenderingContext2D | undefined = undefined
let selectedPoint: CanvasPoint | undefined | null = undefined

const canvas: Ref<HTMLCanvasElement | null> = ref(null)
const canvasStore = computed(() => canvasRoutesStore())

const activeRouteVisuals = computed(() => {
  if (!canvasStore.value.activeRoute) {
    return
  }

  const routeVisuals = canvasStore.value.activeRoute.visuals

  return {
    ...routeVisuals,
    lineVisuals: { ...routeVisuals.lineVisuals },
    textVisuals: { ...routeVisuals.textVisuals },
    pointVisuals: { ...routeVisuals.pointVisuals },
  } as IRouteVisuals
})

const watchedProperties = [
  computed(() => canvasStore.value.width),
  computed(() => canvasStore.value.height),
  activeRouteVisuals,
]

watch(watchedProperties, () => {
  renderCanvas()
})

let pointWatchers: WatchHandle[] = []
watch(
  computed<ICanvasRoute | null>(() => canvasStore.value.activeRoute),
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
  //canvasStore.value.setActiveRoute(canvasStore.value.customRoutes[0].STARs[0])

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
  if (!canvas.value) {
    return
  }

  const target = event.target as HTMLElement

  if (!target) {
    return
  }

  if (selectedPoint) {
    if (canvas.value.id !== target.id) {
      selectedPoint = null
    }
  }
}

function renderCanvas() {
  canvasContext = getCanvasInfo(canvas.value).canvasContext
  setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height)
  drawContent(canvasContext)
}

function drawContent(canvasContext: CanvasRenderingContext2D) {
  const route = canvasStore.value.activeRoute
  if (route && route.visuals.ifVisible) {
    if (route.visuals.ifShowLines) {
      drawCanvasLines_(route, canvasContext)
    }
    if (route.visuals.ifShowPoints) {
      drawCanvasRoutePoints_(route, canvasContext)
    }
    // if (route.routeVisuals.ifShowText) {
    //   DrawCanvasRouteText(route, canvasContext)
    // }
  }
}

function clickPoint(event: MouseEvent) {
  const route = canvasStore.value.activeRoute

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
    canvasStore.value.updateRoutePointCoordinates(selectedPoint, x, y)
    canvasStore.value.makeStandardRouteCustom(canvasStore.value.activeRoute)
    //canvasStore.value.updateIntersectionPoints()
    cleanCanvas(canvasContext)
    //No need to call drawContent again because
    //The route will be drawn because watchers will detect change in coordinates
    selectedPoint = null
  }
}
</script>

<style scoped>
canvas {
  z-index: 2;
}
</style>
