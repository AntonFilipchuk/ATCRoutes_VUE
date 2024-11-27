<template>
    <div>
        <canvas ref="linesCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import type Route from '@/utils/Classes/Route/Route';
import drawLines from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { getRandomColor } from '@/utils/Modules/randomColorGenerator';
import { onMounted, defineProps, ref } from 'vue';

const props = defineProps<{
    canvasWidth: number,
    canvasHeigh: number,
    lineWidth: number,
    routes: Route[]
}>();

const linesCanvas = ref(null)

onMounted(() => {
    try {
        const canvasContext = getCanvasInfo(linesCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, props.canvasWidth, props.canvasHeigh);
        drawContent(canvasContext);
    } catch (error) {
        console.error(error)
    }
})

function drawContent(canvasContext: CanvasRenderingContext2D) {
    props.routes.forEach(route => {
        drawLines(route.points, getRandomColor(), props.lineWidth, canvasContext)
    });
}

</script>

<style scoped>
canvas {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
}
</style>