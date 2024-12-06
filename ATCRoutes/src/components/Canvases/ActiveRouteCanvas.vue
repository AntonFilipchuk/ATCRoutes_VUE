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
    computed(() => canvasStore.value.canvasData?.width),
    computed(() => canvasStore.value.canvasData?.height),
    computed(() => canvasStore.value.canvasData?.activeRoute)
]
let canvasContext: CanvasRenderingContext2D | undefined = undefined;
let selectedPoint: RoutePoint | undefined = undefined;

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
    setCanvasDimensions(canvasContext, canvasStore.value.canvasData!.width, canvasStore.value.canvasData!.height)
    drawContent(canvasContext)
}

function drawContent(canvasContext: CanvasRenderingContext2D) {
    const route = canvasStore.value.canvasData!.activeRoute;
    if (route) {
        drawRouteLines(route.points, "black", route.lineWidth, canvasContext)
        drawRoutePoints(route.points, "black", route.pointWidth, canvasContext)
    }
}

function clickPoint(event: MouseEvent) {

    const route = canvasStore.value.canvasData!.activeRoute;
    if (!route) { return }

    const x = event.offsetX;
    const y = event.offsetY;

    if (!canvasContext) {
        throw new Error("No context for active route canvas");
    }

    if (!selectedPoint) {
        route!.points.forEach(point => {
            if (canvasContext!.isPointInPath(point.path2D!, x, y) ||
                canvasContext!.isPointInStroke(point.path2D!, x, y)) {
                selectedPoint = point;
            }
        }
        )
    }
    else {
        canvasStore.value.canvasData?.changeRoutePoint(selectedPoint, x, y)
        console.log("Point Selected", selectedPoint.name);
        cleanCanvas(canvasContext)
        drawContent(canvasContext)
        selectedPoint = undefined;
    }
}

</script>


<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 3;
}
</style>