<template>
    <div>
        <canvas ref="pointsCanvas"></canvas>
    </div>
</template>
<script setup lang="ts">

import { canvasDataStore } from '@/stores/canvasDataStore';
import type Route from '@/utils/Classes/Route/Route';
import { drawPoints } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { getRandomColor } from '@/utils/Modules/randomColorGenerator';
import { computed, onMounted, ref, watch } from 'vue'

const pointsCanvas = ref(null);
const canvasStore = computed(() => canvasDataStore())
const watchedProperties = [
    computed(() => canvasStore.value.canvasData?.width),
    computed(() => canvasStore.value.canvasData?.height),
    computed(() => canvasStore.value.canvasData?.activeRoute)
]

watch(watchedProperties, () => {
    renderCanvas();
})

onMounted(() => {
    renderCanvas()
})


function renderCanvas() {

    if (!canvasStore.value.canvasData) {
        throw new Error("No canvas data!");
    }

    try {
        const canvasContext = getCanvasInfo(pointsCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, canvasStore.value.canvasData.width, canvasStore.value.canvasData.height);
        drawContent(canvasContext, canvasStore.value.canvasData.inactiveRoutes)
    } catch (error) {
        console.error(error)
    }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: Route[]) {
    routes.forEach(route => {
        drawPoints(route.points, getRandomColor(), route.pointWidth, canvasContext)
    });
}

</script>

<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 1;
}
</style>
