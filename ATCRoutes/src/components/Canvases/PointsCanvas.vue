<template>
    <div>
        <canvas ref="pointsCanvas"></canvas>
    </div>
</template>
<script setup lang="ts">

import type Route from '@/utils/Classes/Route/Route';
import { drawPoints } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { getRandomColor } from '@/utils/Modules/randomColorGenerator';
import { defineProps, onMounted, ref } from 'vue'

const props = defineProps<{
    canvasWidth: number,
    canvasHeigh: number,
    pointWidth: number,
    routes: Route[]
}>();

const pointsCanvas = ref(null);

onMounted(() => {
    try {
        const canvasContext = getCanvasInfo(pointsCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, props.canvasWidth, props.canvasHeigh);
        props.routes.forEach(route => {
            drawPoints(route.points, getRandomColor(), props.pointWidth, canvasContext)
        });
    } catch (error) {
        console.error(error)
    }
})

</script>

<style scoped>
canvas {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
}
</style>
