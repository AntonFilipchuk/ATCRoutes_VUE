<template>
    <canvas></canvas>
</template>


<script setup lang="ts">
import type RoutePoint from '@/utils/Classes/Route/RoutePoint';
import { onMounted } from 'vue'

const pointWidth = 40;

const props = defineProps<{
    canvasWidth: number,
    canvasHeigh: number,
    points: RoutePoint[]
}>();

onMounted(() => {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
        throw new Error("Can't find canvas element!")
    }

    const canvasContext = canvas.getContext("2d")

    if (!canvasContext) {
        throw new Error("Can't access canvas context!")
    }

    canvasContext.canvas.width = props.canvasWidth;
    canvasContext.canvas.height = props.canvasHeigh;

    drawPoints(props.points, canvasContext)
    drawLines(props.points, canvasContext)
    drawText(props.points, canvasContext)
})





function drawPoints(points: RoutePoint[], canvasContext: CanvasRenderingContext2D) {
    points.forEach(point => {
        const path = new Path2D();
        path.rect(point.x - pointWidth / 2, point.y - pointWidth / 2, pointWidth, pointWidth);
        canvasContext.stroke(path);
        canvasContext.fill(path)
    }
    )
}

function drawLines(points: RoutePoint[], canvasContext: CanvasRenderingContext2D) {
    canvasContext.beginPath();
    canvasContext.strokeStyle = "green"
    canvasContext.lineWidth = 5;

    points.forEach((point, index) => {
        if (index == 0) {
            canvasContext.moveTo(point.x, point.y)
        }
        else {
            canvasContext.lineTo(point.x, point.y)
        }
    }
    )
    canvasContext.stroke();
}

function drawText(points: RoutePoint[], canvasContext: CanvasRenderingContext2D) {
    //canvasContext.strokeStyle = strokeColor;
    //canvasContext.fillStyle = fillColor;
    canvasContext.font = `52px Calibri`;
    //canvasContext.lineWidth = 16;
    points.forEach(point => {
        canvasContext.fillText(
            point.name,
            point.x + (point.x / 100) * 2,
            point.y + (point.y / 100) * 2
        );
        // canvasContext.strokeText(
        //     point.name,
        //     point.x + (point.x / 100) * 2,
        //     point.y + (point.y / 100) * 2
        // );
    }
    )
}

</script>


<style scoped>
canvas {
    border: 1px solid blue;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
}
</style>