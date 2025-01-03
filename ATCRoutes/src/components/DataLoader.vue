<template>
  <h1>Loader</h1>
  <div v-if="loading">Loading data</div>
  <div v-if="!loading">
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-if="!errorMessage">
      <!-- <CanvasesData :magnetic-deviation=-11 :use-magnetic-bearing=true origin-point-name="Moscow" /> -->
      <CanvasesData />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CanvasesData from './Canvases-Data.vue'
import { fetchedDataStore } from '@/stores/requests2/fetchedDataStore'

const loading = ref(true)

const errorMessage = ref<string | null>(null)

onMounted(async () => await load())

async function load() {
  try {
    loading.value = true
    await Promise.all([
      fetchedDataStore().fetchStandardRoutes('/AIPRoutes2.json'),
      fetchedDataStore().fetchCustomRoutes('/customRoutes.json'),
      fetchedDataStore().fetchSelectedRouteVisuals('/visuals.json'),
      fetchedDataStore().fetchConflictPointVisuals('/visuals.json'),
    ])
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('An unknown error has occurred while fetching for routes')
    }
    errorMessage.value = 'Error fetching data!'
  } finally {
    loading.value = false
  }
}
</script>
