<!-- eslint-disable vue/no-parsing-error -->
<template>
    <div>
        <div class="global-show-container">
            <div class="container">
                <h1>Show Text</h1>
                <input type="checkbox" v-model="ifAllTextVisible" @change="toggleTextVisibility">
            </div>
            <div class="container">
                <h1>Show Lines</h1>
                <input type="checkbox" v-model="ifAllLinesVisible" @change="toggleLinesVisibility">
            </div>
            <div class="container">
                <h1>Show Points</h1>
                <input type="checkbox" v-model="ifAllPointsVisible" @change="togglePointsVisibility">
            </div>
        </div>
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
                    <th>{{ toUpperCaseFirstLetter(activeRouteWithVisuals.name) }}</th>
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
import { visualSettingsStore } from '@/stores/visualSettingsStore';
import RouteVisibilityOptions from './components/RouteVisibilityOptions.vue';
const activeRouteWithVisuals = computed(() => canvasDataStore().activeRouteWithVisuals)
const inactiveRoutes = computed(() => canvasDataStore().inactiveRoutes);


const ifAllTextVisible = visualSettingsStore().ifShowText
const ifAllLinesVisible = visualSettingsStore().ifShowLines
const ifAllPointsVisible = visualSettingsStore().ifShowPoints

function toUpperCaseFirstLetter(str: string): string {
    if (str) { return str[0].toUpperCase() + str.slice(1, str.length) }
    return ''
}

function toggleTextVisibility() {
    if (ifAllTextVisible.value) {
        inactiveRoutes.value.forEach(route => route.routeVisuals.ifShowText = true)
        return
    }
    inactiveRoutes.value.forEach(route => route.routeVisuals.ifShowText = false)
}

function toggleLinesVisibility() {
    if (ifAllLinesVisible.value) {
        inactiveRoutes.value.forEach(route => route.routeVisuals.ifShowLines = true)
        return
    }
    inactiveRoutes.value.forEach(route => route.routeVisuals.ifShowLines = false)
}

function togglePointsVisibility() {
    if (ifAllPointsVisible.value) {
        inactiveRoutes.value.forEach(route => route.routeVisuals.ifShowPoints = true)
        return
    }
    inactiveRoutes.value.forEach(route => route.routeVisuals.ifShowPoints = false)
}

</script>


<style scoped>
.global-show-container {
    display: flex;
    flex-direction: row;
    border: solid black;
    border-bottom: none;
}

.global-show-container .container {
    display: flex;
    flex-direction: column;
    align-content: center;
    flex: 1 1 0px
}

.global-show-container .container h1 {
    font-size: 28px;
    margin: 0;
    padding-bottom: 3%;
    text-align: center;
}

.global-show-container .container input {
    margin-bottom: 3%;
}

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