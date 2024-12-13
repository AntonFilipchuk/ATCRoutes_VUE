<template>
    <div>
        <canvas ref="canvas" @mousedown="clickPoint" id="activeRouteCanvas" :style="{ 'z-index': zIndex }"></canvas>
    </div>
</template>

<script setup lang="ts">


import { canvasDataStore } from '@/stores/canvasDataStore';
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute';
import type RoutePoint from '@/utils/Classes/Route/RoutePoint';
import drawCanvasRouteLines, { cleanCanvas, drawCanvasRoutePoints, DrawCanvasRouteText } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, onUnmounted, ref, watch, type Ref, type WatchHandle } from 'vue';

defineProps({
    zIndex: { type: Number, required: true },
})

let canvasContext: CanvasRenderingContext2D | undefined = undefined;
let selectedPoint: RoutePoint | undefined | null = undefined;

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const canvasStore = computed(() => canvasDataStore())

const activeRouteVisuals = computed(() => {

    if (!canvasStore.value.activeRouteWithVisuals) {
        return
    }

    const routeVisuals = canvasStore.value.activeRouteWithVisuals.routeVisuals

    return { ...routeVisuals }
})


const watchedProperties = [
    computed(() => canvasStore.value.width),
    computed(() => canvasStore.value.height),
    activeRouteVisuals
]

watch(watchedProperties, () => {
    renderCanvas();
})

let pointWatchers: WatchHandle[] = [];
watch(
    computed<CanvasRoute | null>(() => canvasStore.value.activeRouteWithVisuals),
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
    const route = canvasStore.value.activeRouteWithVisuals
    if (route && route.routeVisuals.ifVisible) {
        if (route.routeVisuals.ifShowLines) {
            drawCanvasRouteLines(route, canvasContext)
        }
        if (route.routeVisuals.ifShowPoints) {
            drawCanvasRoutePoints(route, canvasContext)
        }
        if (route.routeVisuals.ifShowText) {
            DrawCanvasRouteText(route, canvasContext)
        }
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
        //No need to call drawContent again because
        //The route will be drawn because watchers will detect change in coordinates
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