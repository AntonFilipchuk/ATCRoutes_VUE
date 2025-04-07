<template>
  <div class="container">
    <div class="row">
      <p>All</p>
      <input type="checkbox" v-model="route.routeVisuals.ifVisible" />
    </div>
    <div class="row">
      <p>Text</p>
      <input type="checkbox" v-model="route.routeVisuals.ifShowText" />
    </div>
    <div class="row">
      <p>Lines</p>
      <input type="checkbox" v-model="route.routeVisuals.ifShowLines" />
    </div>
    <div class="row">
      <p>Points</p>
      <input type="checkbox" v-model="route.routeVisuals.ifShowPoints" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute'
import type { PropType } from 'vue'

const route = defineModel<CanvasRoute>('route', {
  required: true,
  type: Object as PropType<CanvasRoute>,
})
</script>
<style scoped>
@import '../styles.css';
</style>
