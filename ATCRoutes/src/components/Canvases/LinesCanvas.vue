<template>
    <div>
        <canvas ref="linesCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore';
import type Route from '@/utils/Classes/Route/Route';
import drawRouteLines from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref, watch } from 'vue';

const linesCanvas = ref(null)
const canvasStore = computed(() => canvasDataStore())


const watchedProperties = [
    computed(() => canvasStore.value.width),
    computed(() => canvasStore.value.height),
    computed(() => canvasStore.value.activeRoute)
]

onMounted(() => {
    renderCanvas();
});

watch(watchedProperties, () => { renderCanvas() });

function renderCanvas() {
    try {
        const canvasContext = getCanvasInfo(linesCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height);
        const routes = canvasStore.value.inactiveRoutes
        drawContent(canvasContext, routes);
    } catch (error) {
        console.error(error);
    }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: Route[]) {
    routes.forEach(route => {
        drawRouteLines(route.getPoints(), route.lineColor, route.lineWidth, canvasContext);
    });
}

</script>

<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 0;
    pointer-events: none;
}
</style>