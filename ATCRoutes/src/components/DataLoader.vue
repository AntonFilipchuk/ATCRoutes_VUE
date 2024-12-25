<template>
  <h1>Loader</h1>
  <div v-if="loading">Loading data</div>
  <div v-if="!loading">
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-if="!errorMessage">
      <!-- <CanvasesData :magnetic-deviation=-11 :use-magnetic-bearing=true origin-point-name="Moscow" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { aerodromesStore } from '@/stores/requests2/aerodromesStore'
import { onMounted, ref } from 'vue'
// import CanvasesData from './CanvasesData.vue';
// import { AIPRoutesStore } from '@/stores/requests/AIPRoutesStore';
// import { coordinatesStore } from '@/stores/requests/coordinatesStore';

const loading = ref(true)

const errorMessage = ref<string | null>(null)

onMounted(async () => await load())

async function load() {
  // await AIPRoutesStore().fetchRoutes('/AIPRoutes.json')
  // await coordinatesStore().fetchCoordinates('/coordinates2.json')
  // loading.value = false;

  await aerodromesStore().fetchAerodromes('/AIPRoutes2.json')
  loading.value = aerodromesStore().loading
  errorMessage.value = aerodromesStore().errorMessage

  console.log(aerodromesStore().aerodromes)
}
</script>
