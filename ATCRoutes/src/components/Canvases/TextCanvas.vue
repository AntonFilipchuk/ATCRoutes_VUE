<template>
    <div>
        <canvas ref="textCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore';
import type Route from '@/utils/Classes/Route/Route';
import { drawText } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref, watch, type WatchHandle } from 'vue';

const textCanvas = ref(null)
const canvasStore = computed(() => canvasDataStore())

onMounted(() => {
    renderCanvas();
});


//Watch for active route points coordinates change to correctly display text
let pointWatchers: WatchHandle[] = [];
watch(
    computed<Route | null>(() => canvasStore.value.activeRoute),
    (newActiveRoute) => {

        pointWatchers.forEach(unwatch => unwatch());
        if (!newActiveRoute) {
            return
        }

        // Set up new watchers
        pointWatchers = newActiveRoute.getPoints().map((point) =>
            watch(
                () => [point.getNormalizedCartesianCoordinates().x, point.getNormalizedCartesianCoordinates().y],
                () => {
                    renderCanvas()
                }
            )
        );
    },
    { immediate: true }
);

//Watch for canvas size changes
watch([
    computed<number>(() => canvasStore.value.width),
    computed<number>(() => canvasStore.value.height)],
    () => { renderCanvas() }
)



function renderCanvas() {
    try {
        const canvasContext = getCanvasInfo(textCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height);
        const routes = canvasStore.value.allRoutes
        drawContent(canvasContext, routes);
    } catch (error) {
        console.error(error);
    }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: Route[]) {
    routes.forEach(route => {
        route.getPoints().forEach((point) => {
            drawText(point, 28, "Arial", canvasContext)
        })
    });
}

</script>

<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 2;
    pointer-events: none;
}
</style>