<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>
<script setup lang="ts">
import { activeRouteStore } from '@/stores/activeRouteStore';
import { intersectionsStore } from '@/stores/intersectionsStore';
import type IntersectionPoint from '@/utils/Classes/IntersectionPoint';
import type Route from '@/utils/Classes/Route/Route';
import { cleanCanvas, drawRoutePoint } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import findIntersections from '@/utils/Modules/intersectionsFinder';
import { ref, defineProps, onMounted, computed } from 'vue';


const props = defineProps<{
    canvasWidth: number,
    canvasHeigh: number,
    pointWidth: number,
    routes: Route[]
}>()

defineExpose({
    redrawConflictPoints
})

const canvas = ref(null);
let canvasContext: CanvasRenderingContext2D | undefined = undefined;
const activeRoute = computed(() => activeRouteStore().activeRoute);

onMounted(() => {
    try {
        canvasContext = getCanvasInfo(canvas.value).canvasContext;
        setCanvasDimensions(canvasContext, props.canvasWidth, props.canvasHeigh)
        drawContent(canvasContext)
    } catch (error) {
        console.error(error)
    }
})

function redrawConflictPoints() {
    if (canvasContext) {
        cleanCanvas(canvasContext)
        drawContent(canvasContext);
    }
    else {
        throw new Error("Can't access conflict points canvas context!")
    }
};

//TODO: move calculation of intersections to a separate module

function drawContent(canvasContext: CanvasRenderingContext2D) {
    if (!activeRoute.value) {
        return
    }
    const intersections: IntersectionPoint[] = findIntersections(activeRoute.value, props.routes);

    intersectionsStore().$patch({ intersections: intersections })

    //TODO: FIX point style
    canvasContext.fillStyle = "red"

    intersections.forEach(intersection => {
        drawRoutePoint(intersection, props.pointWidth, canvasContext)
    })
}

</script>
<style lang="">

</style>


<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 2;
}
</style>