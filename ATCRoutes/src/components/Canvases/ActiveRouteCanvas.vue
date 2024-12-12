<template>
    <div>
        <canvas ref="canvas" @mousedown="clickPoint" id="activeRouteCanvas" :style="{ 'z-index': zIndex }"></canvas>
    </div>
</template>

<script setup lang="ts">


import { canvasDataStore } from '@/stores/canvasDataStore';
import type RoutePoint from '@/utils/Classes/Route/RoutePoint';
import { cleanCanvas, drawActiveRouteLines, drawActiveRoutePoints } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';

defineProps({
    zIndex: { type: Number, required: true },
})

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
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

    document.addEventListener('mousedown', resetSelectedPointIfClickOutsideCanvas)

    try {
        renderCanvas();
    } catch (error) {
        console.error(error)
    }
})

onUnmounted(() => {
    document.removeEventListener('mousedown', resetSelectedPointIfClickOutsideCanvas)
})

function resetSelectedPointIfClickOutsideCanvas(event: MouseEvent) {
    if (!canvas.value) {
        return
    }

    const target = event.target as HTMLElement;

    if (!target) {
        return
    }

    if (selectedPoint) {
        if (canvas.value.id !== target.id) {
            selectedPoint = null
        }
    }
}

function renderCanvas() {
    canvasContext = getCanvasInfo(canvas.value).canvasContext;
    setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height)
    drawContent(canvasContext)
}

function drawContent(canvasContext: CanvasRenderingContext2D) {
    const route = canvasStore.value.activeRoute;
    if (route) {
        drawActiveRouteLines(route, canvasStore.value.activeRouteVisuals, canvasContext)
        drawActiveRoutePoints(route, canvasStore.value.activeRouteVisuals, canvasContext)
    }
}

function clickPoint(event: MouseEvent) {
    const route = canvasStore.value.activeRoute;

    if (!canvasContext) {
        throw new Error("No active route or canvas context available.");
    }

    if (!route) {
        return
    }

    const x = event.offsetX;
    const y = event.offsetY;

    if (!selectedPoint) {
        const pointAsPath2D = route.routePointsAsPath2d.find(point => {
            return canvasContext!.isPointInPath(point.path2d, x, y) || canvasContext!.isPointInStroke(point.path2d, x, y)
        }) || null

        if (pointAsPath2D) {
            selectedPoint = route.route.getPoints().find((point) => point.name === pointAsPath2D.name)
            if (!selectedPoint) {
                throw new Error("Can't find a corresponding point in route from points as Path2D. Impossible!")
            }
        }
        else {
            selectedPoint = null
        }
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