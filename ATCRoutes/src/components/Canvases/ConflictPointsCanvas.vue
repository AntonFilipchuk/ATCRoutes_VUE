<template>
    <div>
        <canvas ref="canvas" :style="{ 'z-index': zIndex }"></canvas>
    </div>
</template>
<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore';
import type IntersectionPoint from '@/utils/Classes/IntersectionPoint';
import { drawPoint } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { ref, onMounted, computed, watch } from 'vue';

defineProps({
    zIndex: { type: Number, required: true },
})

const canvas = ref(null);
const canvasStore = computed(() => canvasDataStore())
const watchedProperties = [
    computed(() => canvasStore.value.width),
    computed(() => canvasStore.value.height),
    computed(() => canvasStore.value.activeRoute),
    computed(() => canvasStore.value.intersectionPoints)
]
let canvasContext: CanvasRenderingContext2D | undefined = undefined;

watch(watchedProperties, () => {
    renderCanvas();
})

onMounted(() => {
    try {
        renderCanvas();
    } catch (error) {
        console.error(error)
    }
})

function renderCanvas() {
    canvasContext = getCanvasInfo(canvas.value).canvasContext;
    setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height)
    drawContent(canvasContext)
}

//TODO: move calculation of intersections to a separate module

function drawContent(canvasContext: CanvasRenderingContext2D) {
    const activeRoute = canvasStore.value.activeRoute
    if (!activeRoute) {
        return
    }
    canvasStore.value.updateIntersectionPoints()

    const intersectionPoints: IntersectionPoint[] | null = canvasStore.value.intersectionPoints;

    if (intersectionPoints) {
        intersectionPoints.forEach(intersection => {
            if (!intersection.edgeCaseMessage) {
                drawPoint({ x: intersection.x, y: intersection.y }, "red", "yellow", 25, 5, true, canvasContext)
            }

        })
    }
}



</script>
<style lang="">

</style>


<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 3;
    pointer-events: none;
}
</style>