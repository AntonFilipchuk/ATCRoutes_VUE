<template>
    <div class="global-show-container">
        <div class="container">
            <div class="row">
                <div class="option">
                    <h1>Show Text</h1>
                </div>
                <div class="option"><input type="checkbox" v-model="ifAllTextVisible" @change="toggleTextVisibility">
                </div>
            </div>
            <div class="row">
                <div class="option">
                    <h1>Show Lines</h1>
                </div>
                <div class="option"><input type="checkbox" v-model="ifAllLinesVisible" @change="toggleLinesVisibility">
                </div>
            </div>
            <div class="row">
                <div class="option">
                    <h1>Show Points</h1>
                </div>
                <div class="option"><input type="checkbox" v-model="ifAllPointsVisible"
                        @change="togglePointsVisibility"></div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="option">
                    <h1>Line width</h1>
                </div>
                <div class="option">
                    <h1>{{ lineWidthChange >= 0 ? "+" : "" }}{{ lineWidthChange }}px</h1>
                </div>
                <div class="option">
                    <button class="increase-decrease-button" @click="changeRouteLineWidth(2)">
                        +
                    </button>
                    <button class="increase-decrease-button" @click="changeRouteLineWidth(-2)">
                        -
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="option">
                    <h1>Points width</h1>
                </div>
                <div class="option">
                    <h1>{{ pointsWidthChange >= 0 ? "+" : "" }}{{ pointsWidthChange }}px</h1>
                </div>
                <div class="option">
                    <button class="increase-decrease-button" @click="changeRoutePointsWidth(2)">
                        +
                    </button>
                    <button class="increase-decrease-button" @click="changeRoutePointsWidth(-2)">
                        -
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="option">
                    <h1>Text size</h1>
                </div>
                <div class="option">
                    <h1>{{ textSizeChange >= 0 ? "+" : "" }}{{ textSizeChange }}px</h1>
                </div>
                <div class="option">
                    <button class="increase-decrease-button" @click="changeTextSize(2)">
                        +
                    </button>
                    <button class="increase-decrease-button" @click="changeTextSize(-2)">
                        -
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { canvasDataStore } from '@/stores/internal/canvasDataStore';
import { visualSettingsStore } from '@/stores/internal/visualSettingsStore';
import { computed } from 'vue';

const lineWidthChange = visualSettingsStore().lineWidthChange
const pointsWidthChange = visualSettingsStore().pointsWidthChange
const textSizeChange = visualSettingsStore().textSizeChange

const ifAllTextVisible = visualSettingsStore().ifShowText
const ifAllLinesVisible = visualSettingsStore().ifShowLines
const ifAllPointsVisible = visualSettingsStore().ifShowPoints

const inactiveRoutes = computed(() => canvasDataStore().inactiveRoutes);

function changeRouteLineWidth(change: number) {
    lineWidthChange.value += change
    inactiveRoutes.value.forEach(route => route.routeVisuals.lineVisuals.width += change)
}

function changeRoutePointsWidth(change: number) {
    pointsWidthChange.value += change
    inactiveRoutes.value.forEach(route => route.routeVisuals.pointVisuals.width += change)
}

function changeTextSize(change: number) {
    textSizeChange.value += change
    inactiveRoutes.value.forEach(route => route.routeVisuals.textVisuals.width += change)
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
@import "../styles.css";



.global-show-container {
    display: flex;
    flex: 1 1 0px;
    flex-direction: row;
    border: solid black;
    border-bottom: none;
}

.global-show-container .container {
    display: flex;
    flex-direction: column;
    flex: 1 1 0px;
}

</style>