<template>
    <div>
        <canvas ref="canvas" @mousedown="clickPoint"></canvas>
    </div>
</template>


<script setup lang="ts">

import { activeRouteStore } from '@/stores/activeRouteStore';
import type RoutePoint from '@/utils/Classes/Route/RoutePoint';
import drawLines, { cleanCanvas, drawPoints } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
    canvasWidth: number,
    canvasHeigh: number,
    pointWidth: number,
    lineWidth: number,
}>()

const emits = defineEmits(
    ['activeRouteChange']
)
const activeRoute = computed(() => activeRouteStore().activeRoute);

const canvas = ref(null);
let canvasContext: CanvasRenderingContext2D | undefined = undefined;
let selectedPoint: RoutePoint | undefined = undefined;

onMounted(() => {
    try {
        canvasContext = getCanvasInfo(canvas.value).canvasContext;
        setCanvasDimensions(canvasContext, props.canvasWidth, props.canvasHeigh)
        drawContent(canvasContext)
    } catch (error) {
        console.error(error)
    }
})

function drawContent(canvasContext: CanvasRenderingContext2D) {
    if (activeRoute.value) {
        drawLines(activeRoute.value.points, "black", props.lineWidth, canvasContext)
        drawPoints(activeRoute.value.points, "black", props.pointWidth, canvasContext)
    }
    else {
        console.error("No route to draw!")
    }
}

function clickPoint(event: MouseEvent) {

    if (!activeRoute.value) { return }

    const x = event.offsetX;
    const y = event.offsetY;

    if (!canvasContext) {
        throw new Error("No context for active route canvas");
    }

    if (!selectedPoint) {
        activeRoute.value.points.forEach(point => {
            if (canvasContext!.isPointInPath(point.path2D!, x, y) ||
                canvasContext!.isPointInStroke(point.path2D!, x, y)) {
                selectedPoint = point;
            }
        }
        )
    }
    else {
        selectedPoint.x = x;
        selectedPoint.y = y;
        cleanCanvas(canvasContext)
        drawContent(canvasContext)
        selectedPoint = undefined;
        emits('activeRouteChange')
    }

}

</script>


<style scoped>
canvas {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
}
</style>