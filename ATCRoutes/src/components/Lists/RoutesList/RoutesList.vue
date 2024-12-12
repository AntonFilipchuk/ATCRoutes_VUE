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
                <tr v-if="activeRoute">
                    <th>{{ toUpperFirstLetter(activeRoute.name) }}</th>
                    <td> <input type="checkbox" v-model="activeRoute.ifVisible"></td>
                    <td>
                        <div :style="{
                            'background-color': activeRoute.routeVisuals.lineColor
                        }">&nbsp</div>
                    </td>
                    <td>
                        <div>{{ activeRoute.routeVisuals.lineWidth }} <button>+</button> <button>-</button></div>
                    </td>
                    <td>
                        <div :style="{
                            'background-color': activeRoute.routeVisuals.pointColor
                        }">&nbsp</div>
                    </td>
                    <td>{{ activeRoute.routeVisuals.pointWidth }}</td>
                </tr>
                <tr v-for="(route, index) in inactiveRoutes" :key="index">
                    <th>{{ toUpperFirstLetter(route.name) }}</th>
                    <td>
                        <div class="show-container">
                            <div class="show-option">
                                <p>All</p> <input type="checkbox" v-model="route.ifVisible">
                            </div>
                            <div class="show-option">
                                <p>Text</p> <input type="checkbox" v-model="route.routeVisuals.ifShowText">
                            </div>
                            <div class="show-option">
                                <p>Lines</p> <input type="checkbox" v-model="route.routeVisuals.ifShowLines">
                            </div>
                            <div class="show-option">
                                <p>Points</p> <input type="checkbox" v-model="route.routeVisuals.ifShowPoints">
                            </div>
                        </div>
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
import VisualParameters from './VisualParameters.vue';
import TextVisualParameters from './TextVisualParameters.vue';
import { visualSettingsStore } from '@/stores/visualSettingsStore';
const activeRoute = computed(() => canvasDataStore().activeRoute)
const inactiveRoutes = computed(() => canvasDataStore().inactiveRoutes);



const ifAllTextVisible = visualSettingsStore().ifShowText
const ifAllLinesVisible = visualSettingsStore().ifShowLines
const ifAllPointsVisible = visualSettingsStore().ifShowPoints

function toUpperFirstLetter(str: string): string {
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

.show-container {
    display: flex;
    flex-direction: column;
}

.show-container .show-option:nth-child(even) {
    background-color: rgb(183, 183, 183)
}

.show-container .show-option:nth-child(odd) {
    background-color: rgb(233, 233, 233)
}

.show-container .show-option {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between
}

input {
    padding: 0;
    margin: 0;
    min-width: 25px;
    min-height: 25px;
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