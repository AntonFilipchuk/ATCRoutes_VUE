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
import { standardRoutesStore } from '@/stores/requests2/standardRoutesStore'
import { onMounted, ref } from 'vue'
import CanvasesData from './Canvases-Data.vue'
import { customRoutesStore } from '@/stores/requests2/customRoutesStore'

const loading = ref(true)

const errorMessage = ref<string | null>(null)

onMounted(async () => await load())

async function load() {
  try {
    loading.value = true
    await Promise.all([
      standardRoutesStore().fetchRoutes('/AIPRoutes2.json'),
      customRoutesStore().fetchRoutes('/customRoutes.json'),
    ])
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('An unknown error has occurred while fetching for routes')
    }

    errorMessage.value =
      (standardRoutesStore().errorMessage || '') +
      (customRoutesStore().errorMessage ? ` | ${customRoutesStore().errorMessage}` : '')
  } finally {
    loading.value = false
  }
}
</script>
