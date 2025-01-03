import Canvas_Data from '@/utils/Classes/Canvas_Data'
import type CanvasPoint from '@/utils/Interfaces/CanvasRoute/CanvasPoint'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import type IAerodrome from '@/utils/Interfaces/IAerodrome'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export const canvasRoutesStore = defineStore('canvasRoutesStore', () => {
  
  const canvasData: Ref<Canvas_Data | undefined> = ref(undefined)

  function ensureCanvasData(): Canvas_Data {
    if (!canvasData.value) {
      throw new Error('No CanvasData!')
    }
    return canvasData.value
  }

  function createCanvasData(
    width: number,
    height: number,
    deviation: number,
    standardRoutes: IAerodrome[],
    customRoutes: IAerodrome[],
  ) {
    canvasData.value = new Canvas_Data(width, height, deviation, standardRoutes, customRoutes)
  }

  function updateRoutePointCoordinates(point: CanvasPoint, x: number, y: number) {
    ensureCanvasData().updatePoint(point, x, y)
  }

  const activeRoute = computed(() => {
    console.log('Canvas store', ensureCanvasData().selectedRoute)

    return ensureCanvasData().selectedRoute
  })

  const routeType = computed(() => {
    return ensureCanvasData().selectedRouteType
  })

  const routeCategory = computed(() => {
    return ensureCanvasData().selectedRouteCategory
  })

  function setActiveRoute(route: ICanvasRoute) {
    ensureCanvasData().setSelectedRoute(route)
  }

  function getAllRoutes(): ICanvasRoute[] {
    return ensureCanvasData().getAllRoutes()
  }

  function getRoutesForSelection() {
    return ensureCanvasData().getRoutesForSelection()
  }

  const activeAerodrome = computed(() => {
    return ensureCanvasData().selectedAerodromeName
  })

  function setActiveAerodrome(a: string) {
    ensureCanvasData().setAerodromeName(a)
  }

  function getAerodromesForSelection() {
    return ensureCanvasData().getAerodromeNames()
  }

  function getRouteTypes() {
    return ensureCanvasData().getRouteTypes()
  }

  function setRouteType(t: string) {
    return ensureCanvasData().setRouteType(t)
  }

  function getRouteCategories() {
    return ensureCanvasData().getRouteCategories()
  }

  function setRouteCategory(c: string) {
    return ensureCanvasData().setRouteCategory(c)
  }

  function makeStandardRouteCustom(route: ICanvasRoute) {
    return ensureCanvasData().makeStandardRouteToCustom(route)
  }

  const width = computed(() => {
    return ensureCanvasData().width
  })

  const height = computed(() => {
    return ensureCanvasData().height
  })

  const customRoutes = computed(() => {
    return ensureCanvasData().customRoutes
  })

  const standardRoutes = computed(() => {
    return ensureCanvasData().filteredStandardRoutes
  })

  return {
    width,
    height,
    customRoutes,
    standardRoutes,
    activeRoute,
    activeAerodrome,
    routeType,
    routeCategory,
    getRouteCategories,
    setRouteCategory,
    setActiveAerodrome,
    getRouteTypes,
    setRouteType,
    makeStandardRouteCustom,
    getAerodromesForSelection,
    getAllRoutes,
    getRoutesForSelection,
    setActiveRoute,
    createCanvasData,
    updateRoutePointCoordinates,
  }
})
