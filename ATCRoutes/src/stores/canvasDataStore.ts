import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type CanvasData from '@/utils/Classes/CanvasData'
import type Route from '@/utils/Classes/Route/Route'
import type RoutePoint from '@/utils/Classes/Route/RoutePoint'

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

  function setInactiveRoutes(routes: Route[]) {
    ensureCanvasData().inactiveRoutes = routes
  }

  function changeCanvasSize(width: number, heigh: number) {
    ensureCanvasData().changeSize(width, heigh)
  }

  function setActiveRoute(route: Route) {
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
    return ensureCanvasData().activeRoute
  })

  const inactiveRoutes = computed(() => {
    return ensureCanvasData().inactiveRoutes
  })

  const allRoutes = computed(() => {
    return ensureCanvasData().allRoutes
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
    setInactiveRoutes,
    setActiveRoute,
    updateIntersectionPoints,
    intersectionPoints,
    activeRoute,
    inactiveRoutes,
    allRoutes,
    width,
    height,
  }
})
