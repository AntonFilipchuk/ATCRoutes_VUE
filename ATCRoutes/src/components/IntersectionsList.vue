<template>
    <div>

        <table>
            <thead>
                <tr>
                    <th scope="col">Number</th>
                    <th scope="col">Routes</th>
                    <th scope="col">Sections</th>
                    <th scope="col">Altitude</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(intersection, index) in intersections" :key="index">
                    <th>{{ index + 1 }}</th>
                    <td>{{ intersection.route1.name }} - {{ intersection.route2.name }}</td>
                    <td>[{{ intersection.sectionRoute1[0].name }} - {{ intersection.sectionRoute1[1].name }}] - [{{
                        intersection.sectionRoute2[0].name }} - {{ intersection.sectionRoute2[1].name }}]</td>
                        <td>FL{{ intersection.z }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import { intersectionsStore } from '@/stores/intersectionsStore';
import { computed } from 'vue';
const intersections = computed(() => intersectionsStore().intersections);
</script>
<style></style>