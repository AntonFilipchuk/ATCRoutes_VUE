<template>
  <div style="display: flex; flex-direction: column; align-items: baseline; gap: 10px">
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
        <h1>Route Category:</h1>
      </div>
      <select v-model="selectedRouteCategory">
        <option
          v-for="(routeCategory, index) in routeCategories"
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
    <!-- <PointsCanvas_ /> -->
    <LinesCanvas_ />
    <ActiveRouteCanvas_ />
  </div>
</template>

<script setup lang="ts">
import { canvasRoutesStore } from '@/stores/requests2/canvasRoutesStore'
import LinesCanvas_ from './Canvases/LinesCanvas_.vue'
import { customRoutesStore } from '@/stores/requests2/customRoutesStore'
import { standardRoutesStore } from '@/stores/requests2/standardRoutesStore'
import ActiveRouteCanvas_ from './Canvases/ActiveRouteCanvas_.vue'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import { computed } from 'vue'

const selectedRoute = computed({
  get() {
    return canvasRoutesStore().activeRoute
  },
  set(route: ICanvasRoute) {
    canvasRoutesStore().setActiveRoute(route)
  },
})

const selectedAerodromeName = computed({
  get() {
    return canvasRoutesStore().activeAerodrome
  },
  set(a: string) {
    canvasRoutesStore().setActiveAerodrome(a)
  },
})

const selectedRouteType = computed({
  get() {
    return canvasRoutesStore().routeType
  },
  set(t: string) {
    canvasRoutesStore().setRouteType(t)
  },
})

const selectedRouteCategory = computed({
  get() {
    return canvasRoutesStore().routeCategory
  },
  set(c: string) {
    canvasRoutesStore().setRouteCategory(c)
  },
})

const routeTypes = computed(() => canvasRoutesStore().getRouteTypes())
const routeCategories = computed(() => canvasRoutesStore().getRouteCategories())
const aerodromes = computed(() => canvasRoutesStore().getAerodromesForSelection())
const routes = computed(() => canvasRoutesStore().getRoutesForSelection())

const customRoutes = customRoutesStore().aerodromes
const standardRoutes = standardRoutesStore().aerodromes

canvasRoutesStore().createCanvasData(1000, 1000, -11, standardRoutes, customRoutes)
</script>

<style></style>
