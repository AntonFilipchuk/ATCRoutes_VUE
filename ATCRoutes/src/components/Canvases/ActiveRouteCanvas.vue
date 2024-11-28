<template>
    <div>
        <canvas ref="canvas" @mousedown="clickPoint"></canvas>
    </div>
</template>


<script setup lang="ts">

import type Route from '@/utils/Classes/Route/Route';
import type RoutePoint from '@/utils/Classes/Route/RoutePoint';
import drawLines, { cleanCanvas, drawPoints } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { onMounted, ref } from 'vue';

const props = defineProps<{
    canvasWidth: number,
    canvasHeigh: number,
    pointWidth: number,
    lineWidth: number,
    route: Route | undefined
}>()

const emits = defineEmits(
    ['activeRouteChange']
)

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
    if (props.route) {
        drawLines(props.route.points, "black", props.lineWidth, canvasContext)
        drawPoints(props.route.points, "black", props.pointWidth, canvasContext)
    }

}

function clickPoint(event: MouseEvent) {

    if (!props.route) { return }

    const x = event.offsetX;
    const y = event.offsetY;

    if (!canvasContext) {
        throw new Error("No context for active route canvas");
    }

    if (!selectedPoint) {
        props.route.points.forEach(point => {
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