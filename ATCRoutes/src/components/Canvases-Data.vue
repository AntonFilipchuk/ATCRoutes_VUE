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
      <select v-model="ifSelectedRouteStandard">
        <option
          v-for="(routeCategory, index) in RouteCategories"
          :key="index"
          :value="routeCategory"
        >
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
    <PointsCanvas_ />
    <LinesCanvas_ />
    <ActiveRouteCanvas_ />
  </div>
</template>

<script setup lang="ts">
import LinesCanvas_ from './Canvases/LinesCanvas_.vue'
import { customRoutesStore } from '@/stores/requests2/customRoutesStore'
import { standardRoutesStore } from '@/stores/requests2/standardRoutesStore'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import { computed } from 'vue'
import { canvasStore } from '@/stores/requests2/canvasStore'
import RoutePoint_ from '@/utils/Classes/Route/RoutePoint_'
import ActiveRouteCanvas_ from './Canvases/ActiveRouteCanvas_.vue'
import PointsCanvas_ from './Canvases/PointsCanvas_.vue'

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

enum RouteCategories {
  Custom = 'Custom',
  Standard = 'Standard',
}

const ifSelectedRouteStandard = computed({
  get() {
    return canvasStore().ifSelectedRouteStandard
  },
  set(c: RouteCategories) {
    switch (c) {
      case RouteCategories.Custom:
        canvasStore().ifSelectedRouteStandard = false
        break
      case RouteCategories.Standard:
        canvasStore().ifSelectedRouteStandard = true
        break

      default:
        throw new Error('Error setting route category')
    }
  },
})

const routeTypes = computed(() => canvasStore().getRouteTypes())
const aerodromes = computed(() => canvasStore().getAerodromeNames())
const routes = computed(() => {
  console.log('getting routes')
  return canvasStore().getRoutesForSelection()
})

const customRoutes = customRoutesStore().aerodromes
const standardRoutes = standardRoutesStore().aerodromes

canvasStore().init(
  1000,
  1000,
  -11,
  standardRoutes,
  customRoutes,
  new RoutePoint_('Moscow', '0', '554424.63N', '0373636.00E'),
)
</script>

<style></style>
