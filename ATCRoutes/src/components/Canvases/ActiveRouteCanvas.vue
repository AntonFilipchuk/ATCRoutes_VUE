<template>
    <div>
        <canvas ref="canvas" @mousedown="clickPoint"></canvas>
    </div>
</template>

<script setup lang="ts">


import { canvasDataStore } from '@/stores/canvasDataStore';
import type RoutePoint from '@/utils/Classes/Route/RoutePoint';
import drawRouteLines, { cleanCanvas, drawRoutePoints } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref, watch } from 'vue';


const canvas = ref(null);
const canvasStore = computed(() => canvasDataStore())
const watchedProperties = [
    computed(() => canvasStore.value.width),
    computed(() => canvasStore.value.height),
    computed(() => canvasStore.value.activeRoute)
]
let canvasContext: CanvasRenderingContext2D | undefined = undefined;
let selectedPoint: RoutePoint | undefined | null = undefined;

watch(watchedProperties, () => {
    renderCanvas();
})

onMounted(() => {
    try {
        renderCanvas();
    } catch (error) {
        console.error(error)
    }
})

function renderCanvas() {
    canvasContext = getCanvasInfo(canvas.value).canvasContext;
    setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height)
    drawContent(canvasContext)
}

function drawContent(canvasContext: CanvasRenderingContext2D) {
    const route = canvasStore.value.activeRoute;
    if (route) {
        drawRouteLines(route.getPoints(), "black", route.lineWidth, canvasContext)
        drawRoutePoints(route.getPoints(), "black", route.pointWidth, canvasContext)
    }
}

function clickPoint(event: MouseEvent) {
    const route = canvasStore.value.activeRoute;

    if (!route || !canvasContext) {
        throw new Error("No active route or canvas context available.");
    }

    const x = event.offsetX;
    const y = event.offsetY;

    if (!selectedPoint) {
        selectedPoint = route.getPoints().find(point =>
            point.path2D &&
            (canvasContext!.isPointInPath(point.path2D, x, y) || canvasContext!.isPointInStroke(point.path2D, x, y))
        ) || null;
    } else {
        canvasStore.value.updateRoutePointCoordinates(selectedPoint, x, y);
        canvasStore.value.updateIntersectionPoints()
        cleanCanvas(canvasContext);
        drawContent(canvasContext);
        selectedPoint = null;
    }
}


</script>


<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 2;
}
</style>