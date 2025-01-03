<template>
  <div style="display: flex; flex-direction: row; align-items: baseline; gap: 10px">
    <div>
      <div>
        <h1>Selected aerodrome:</h1>
      </div>
      <select v-model="selectedAerodromeName">
        <option v-for="(aerodrome, index) in aerodromes" :key="index" :value="aerodrome">
          {{ aerodrome }}
        </option>
      </select>
    </div>
    <div v-if="selectedAerodromeName">
      <div>
        <h1>Route Type:</h1>
      </div>
      <select v-model="selectedRouteType">
        <option v-for="(routeType, index) in routeTypes" :key="index" :value="routeType">
          {{ routeType }}
        </option>
      </select>
    </div>
    <div v-if="selectedAerodromeName">
      <div>
        <h1>Route category</h1>
      </div>
      <select v-model="routeCategory">
        <option v-for="(routeCategory, index) in RouteCategory" :key="index" :value="routeCategory">
          {{ routeCategory }}
        </option>
      </select>
    </div>
    <div v-if="selectedAerodromeName">
      <div>
        <h1>Route:</h1>
      </div>
      <select style="font-size: 32px" v-model="selectedRoute">
        <option v-for="(route, index) in routes" :key="index" :value="route">
          {{ route.name }}
        </option>
      </select>
    </div>
  </div>
  <div>
    <GridCanvas :z-index="0" />
    <LinesCanvas_ :z-index="1" />
    <PointsCanvas_ :z-index="2" />
    <ActiveRouteCanvas_ :z-index="3" />
    <ConflictPointsCanvas :z-index="5" />
    <TextCanvas :z-index="4" />
  </div>
</template>

<script setup lang="ts">
import LinesCanvas_ from './Canvases/LinesCanvas_.vue'
import { fetchedDataStore } from '@/stores/requests2/fetchedDataStore'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import { computed } from 'vue'
import { canvasStore } from '@/stores/requests2/canvasStore'
import RoutePoint_ from '@/utils/Classes/Route/RoutePoint_'
import ActiveRouteCanvas_ from './Canvases/ActiveRouteCanvas_.vue'
import PointsCanvas_ from './Canvases/PointsCanvas_.vue'
import { RouteCategory } from '@/utils/Enums/RouteCategory'
import GridCanvas from './Canvases/GridCanvas.vue'
import TextCanvas from './Canvases/TextCanvas.vue'
import ConflictPointsCanvas from './Canvases/ConflictPointsCanvas.vue'

const selectedRoute = computed({
  get() {
    return canvasStore().selectedRoute
  },
  set(route: ICanvasRoute) {
    canvasStore().setSelectedRoute(route)
  },
})

const selectedAerodromeName = computed({
  get() {
    return canvasStore().selectedAerodromeName
  },
  set(a: string) {
    canvasStore().setAerodromeName(a)
  },
})

const selectedRouteType = computed({
  get() {
    return canvasStore().selectedRouteType
  },
  set(t: string) {
    canvasStore().setRouteType(t)
  },
})

const routeCategory = computed({
  get() {
    if (canvasStore().ifSelectedRouteStandard) {
      return RouteCategory.Standard
    }
    return RouteCategory.Custom
  },
  set(c: RouteCategory) {
    switch (c) {
      case RouteCategory.Custom:
        canvasStore().setRouteCategory(false)
        break
      case RouteCategory.Standard:
        canvasStore().setRouteCategory(true)
        break

      default:
        throw new Error('Error setting route category')
    }
  },
})

const routeTypes = computed(() => canvasStore().getRouteTypes())
const aerodromes = computed(() => canvasStore().getAerodromeNames())
const routes = computed(() => {
  return canvasStore().getRoutesForSelection()
})

const customRoutes = fetchedDataStore().customRoutes
const standardRoutes = fetchedDataStore().standardRoutes
const selectedRouteVisuals = fetchedDataStore().selectedRouteVisual!
const conflictPointVisuals = fetchedDataStore().conflictPointVisual!

canvasStore().init(
  1500,
  1500,
  -11,
  standardRoutes,
  customRoutes,
  selectedRouteVisuals,
  conflictPointVisuals,
  new RoutePoint_('Moscow', '0', '554424.63N', '0373636.00E'),
)
</script>

<style></style>
