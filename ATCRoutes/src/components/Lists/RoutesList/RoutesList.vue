<template>
    <div>
        <GlobalVisualOptions />
        <table>
            <thead>
                <tr style="background-color: white;">
                    <th scope="col">Name</th>
                    <th scope="col">Show </th>
                    <th scope="col">Line</th>
                    <th scope="col">Points</th>
                    <th scope="col">Text</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="activeRouteWithVisuals">
                    <th>
                        <p>Active route: {{ toUpperCaseFirstLetter(activeRouteWithVisuals.name) }}</p>
                    </th>
                    <td>
                        <RouteVisibilityOptions v-model:route="activeRouteWithVisuals" />
                    </td>
                    <td>
                        <VisualParameters v-model:visual="activeRouteWithVisuals.routeVisuals.lineVisuals" />
                    </td>
                    <td>
                        <VisualParameters v-model:visual="activeRouteWithVisuals.routeVisuals.pointVisuals" />
                    </td>
                    <td>
                        <TextVisualParameters v-model:visual="activeRouteWithVisuals.routeVisuals.textVisuals" />
                    </td>
                </tr>
                <tr v-for="(route, index) in inactiveRoutes" :key="index">
                    <th>{{ toUpperCaseFirstLetter(route.name) }}</th>
                    <td>
                        <RouteVisibilityOptions v-model:route="inactiveRoutes[index]" />
                    </td>
                    <td>
                        <VisualParameters v-model:visual="route.routeVisuals.lineVisuals" />
                    </td>
                    <td>
                        <VisualParameters v-model:visual="route.routeVisuals.pointVisuals" />
                    </td>
                    <td>
                        <TextVisualParameters v-model:visual="route.routeVisuals.textVisuals" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore';
import { computed } from 'vue';
import VisualParameters from './components/VisualParameters.vue';
import TextVisualParameters from './components/TextVisualParameters.vue';
import RouteVisibilityOptions from './components/RouteVisibilityOptions.vue';
import GlobalVisualOptions from './components/GlobalVisualOptions.vue';
const activeRouteWithVisuals = computed(() => canvasDataStore().activeRouteWithVisuals)
const inactiveRoutes = computed(() => canvasDataStore().inactiveRoutes);
function toUpperCaseFirstLetter(str: string): string {
    if (str) { return str[0].toUpperCase() + str.slice(1, str.length) }
    return ''
}
</script>


<style scoped>
table {
    border: 3px solid black;
    border-collapse: collapse;
    width: 100%;
    font-size: 28px;
}

td,
th {
    border: 3px solid black;
    border-collapse: collapse;
}


table th,
td {
    padding: 0;
    text-align: center;
}


table tr:nth-child(odd) {
    background-color: rgb(214, 214, 214);
}

table tr:nth-child(even) {
    background-color: rgb(164, 164, 164);
}
</style>