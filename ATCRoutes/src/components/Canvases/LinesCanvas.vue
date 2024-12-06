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
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';



const linesCanvas = ref(null)
const canvasStore = storeToRefs(canvasDataStore())

onMounted(() => {
    renderCanvas();
});

watch(
    canvasStore.canvasData,
    (newData) => {
        if (newData) {
            renderCanvas();
        }
    },
    { deep: true }
);

function renderCanvas() {
    if (!canvasStore.canvasData.value) {
        throw new Error("No canvas data!");
    }

    try {
        const canvasContext = getCanvasInfo(linesCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, canvasStore.canvasData.value.width, canvasStore.canvasData.value.height);
        const routes = canvasStore.canvasData.value.allRoutes
        drawContent(canvasContext, routes);
    } catch (error) {
        console.error(error);
    }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: Route[]) {
    routes.forEach(route => {
        drawRouteLines(route.points, route.lineColor, route.lineWidth, canvasContext);
    });
}

</script>

<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 0;
}
</style>