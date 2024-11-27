<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>
<script setup lang="ts">
import type IntersectionPoint from '@/utils/Classes/IntersectionPoint';
import type Route from '@/utils/Classes/Route/Route';
import { drawPoint } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import findIntersections from '@/utils/Modules/intersectionsFinder';
import { ref, defineProps, onMounted } from 'vue';


const props = defineProps<{
    canvasWidth: number,
    canvasHeigh: number,
    pointWidth: number,
    activeRoute: Route | undefined,
    routes: Route[]
}>()

const canvas = ref(null);
let canvasContext: CanvasRenderingContext2D | undefined = undefined;

onMounted(() => {
    console.log(props.activeRoute, props.routes);

    try {
        canvasContext = getCanvasInfo(canvas.value).canvasContext;
        setCanvasDimensions(canvasContext, props.canvasWidth, props.canvasHeigh)
        drawContent(canvasContext)
    } catch (error) {
        console.error(error)
    }
})

function drawContent(canvasContext: CanvasRenderingContext2D) {
    if (!props.activeRoute) {
        return
    }
    const intersections: IntersectionPoint[] = findIntersections(props.activeRoute, props.routes);

    //intersections = intersections.slice(0,1)

    console.log(intersections);
    
    
    canvasContext.fillStyle = "red"

    intersections.forEach(intersection => {
        drawPoint(intersection, props.pointWidth, canvasContext)
    })
}

</script>
<style lang="">

</style>


<style scoped>
canvas {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
}
</style>