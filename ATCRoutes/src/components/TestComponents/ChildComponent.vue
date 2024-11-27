<template>
    <ul>
        <li v-for="coordinate in coordinates" :key="coordinate.name">
            {{ displayCoordinate(coordinate) }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import GeographicCoordinate from '@/utils/Classes/GeographicCoordinate';
import { defineProps } from 'vue';

// Define the props for the component
defineProps<{ coordinates: GeographicCoordinate[] }>();

function displayCoordinate(coordinate: GeographicCoordinate) {
    return `Name: ${coordinate.name}.
    Latitude: ${coordinate.latitude}. Longitude: ${coordinate.longitude}.
    LatDeg: ${coordinate.latitudeDegrees}. LongDeg: ${coordinate.longitudeDegrees}.`
}

</script>