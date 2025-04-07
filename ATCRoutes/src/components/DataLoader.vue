<template>
  <h1>Loader</h1>
  <div v-if="loading">Loading data</div>
  <div v-if="!loading">
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-if="!errorMessage">
      <CanvasDataDashboard
        :magnetic-deviation="-11"
        :use-magnetic-bearing="true"
        origin-point-name="Moscow"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AIPRoutesStore } from '@/stores/AIPRoutesStore'
import { coordinatesStore } from '@/stores/coordinatesStore'
import CanvasDataDashboard from './CanvasDataDashboard.vue'

const loading = ref(true)

const errorMessage: string | null = null

onMounted(async () => await load())

async function load() {
  await AIPRoutesStore().fetchRoutes('/AIPRoutes.json')
  await coordinatesStore().fetchCoordinates('/coordinates2.json')
  loading.value = false
}
</script>
