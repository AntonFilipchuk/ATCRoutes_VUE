<template>
    <div>
        <canvas ref="textCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore';
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute';
import { drawRoutePointsText } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref, watch, type WatchHandle } from 'vue';

const textCanvas = ref(null)
const canvasStore = computed(() => canvasDataStore())

onMounted(() => {
    renderCanvas();
});

const watchedRoutesVisualProps = computed(() => canvasStore.value.inactiveRoutes.map((route) => {
    return {
        ifVisible: route.ifVisible,
        ifShowText: route.routeVisuals.ifShowText,
        ...route.routeVisuals.textVisuals
    }
}))


//Watch for active route points coordinates change to correctly display text
let pointWatchers: WatchHandle[] = [];
watch(
    computed<CanvasRoute | null>(() => canvasStore.value.activeRoute),
    (newActiveRoute) => {

        pointWatchers.forEach(unwatch => unwatch());
        if (!newActiveRoute) {
            return
        }

        // Set up new watchers
        pointWatchers = newActiveRoute.route.getPoints().map((point) =>
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
    computed<number>(() => canvasStore.value.height),
    watchedRoutesVisualProps],
    () => { renderCanvas() }
)



function renderCanvas() {
    try {
        const canvasContext = getCanvasInfo(textCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height);
        const routes = canvasStore.value.allRoutes.filter((route) => route.ifVisible && route.routeVisuals.ifShowText)
        drawContent(canvasContext, routes);
    } catch (error) {
        console.error(error);
    }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: CanvasRoute[]) {
    routes.forEach(route => {
        drawRoutePointsText(route, canvasContext)
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