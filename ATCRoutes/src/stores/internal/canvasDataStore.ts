import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type CanvasData from '@/utils/Classes/CanvasData'
import type RoutePoint from '@/utils/Classes/Route/RoutePoint'
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute'

export const canvasDataStore = defineStore('canvasDataStore', () => {
  const canvasData: Ref<CanvasData | undefined> = ref(undefined)

  function ensureCanvasData(): CanvasData {
    if (!canvasData.value) {
      throw new Error('No CanvasData!')
    }
    return canvasData.value
  }

  function setCanvasData(canvasData_: CanvasData) {
    canvasData.value = canvasData_
  }

  function changeCanvasSize(width: number, heigh: number) {
    ensureCanvasData().changeSize(width, heigh)
  }

  function setActiveRoute(route: CanvasRoute) {
    ensureCanvasData().setActiveRoute(route)
  }

  function updateRoutePointCoordinates(
    routePoint: RoutePoint,
    normalizedX: number,
    normalizedY: number,
  ) {
    ensureCanvasData().updateRoutePointCoordinates(routePoint, normalizedX, normalizedY)
  }

  function updateIntersectionPoints() {
    return ensureCanvasData().updateIntersectionPoints()
  }

  const intersectionPoints = computed(() => {
    return ensureCanvasData().intersectionPoints
  })

  const activeRoute = computed(() => {
    return ensureCanvasData().activeCanvasRoute
  })

  const activeRouteWithVisuals = computed(() => {
    return ensureCanvasData().getActiveRouteWithVisuals()
  })

  const inactiveRoutes = computed(() => {
    return ensureCanvasData().inactiveCanvasRoutes
  })

  const allRoutes = computed(() => {
    return ensureCanvasData().allCanvasRoutes
  })

  const width = computed(() => {
    return ensureCanvasData().width
  })
  const height = computed(() => {
    return ensureCanvasData().height
  })


  return {
    updateRoutePointCoordinates,
    setCanvasData,
    changeCanvasSize,
    setActiveRoute,
    updateIntersectionPoints,
    intersectionPoints,
    activeRoute,
    activeRouteWithVisuals,
    inactiveRoutes,
    allRoutes,
    width,
    height,
  }
})
