<template>
  <div>
    <table>
      <thead>
        <tr>
          <th scope="col">Number</th>
          <th scope="col">Name</th>
          <th scope="col">Latutide</th>
          <th scope="col">Longutude</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(coordinate, index) in coordinates" :key="index">
          <th>{{ index + 1 }}</th>
          <td>{{ coordinate.name }}</td>
          <td>{{ coordinate.getLatLonDMS().latitude }}</td>
          <td>{{ coordinate.getLatLonDMS().longitude }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { coordinatesStore } from '@/stores/coordinatesStore'
import { computed } from 'vue'
const coordinates = computed(() => coordinatesStore().coordinates)
</script>
<style scoped>
table {
  width: 100%;
  font-size: 28px;
}

table th,
td {
  text-align: center;
}
</style>
