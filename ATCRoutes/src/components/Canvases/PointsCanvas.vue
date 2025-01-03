<template>
    <div>
        <canvas ref="pointsCanvas" :style="{ 'z-index': zIndex }"></canvas>
    </div>
</template>
<script setup lang="ts">


import { canvasDataStore } from '@/stores/internal/canvasDataStore';
import { canvasStore } from '@/stores/requests2/canvasStore';
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute';
import { drawPoints } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref, watch } from 'vue'

defineProps({
    zIndex: { type: Number, required: true },
})

const pointsCanvas = ref(null);
const canvas = computed(() => canvasStore())

const watchedProperties = [
    computed(() => canvas.value.width),
    computed(() => canvas.value.height),
    computed(() => canvas.value.selectedRoute)
]


// const watchedRoutesVisualProps = computed(() =>
//     canvas.value.inactiveRoutes.map(route => {
//         return { ...route.routeVisuals.pointVisuals, ifShowPoints: route.routeVisuals.ifShowPoints, ifVisible: route.routeVisuals.ifVisible }
//     })
// );

watch([...watchedProperties], () => {
    renderCanvas();
})

onMounted(() => {
    renderCanvas()
})


function renderCanvas() {
    try {
        const canvasContext = getCanvasInfo(pointsCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, canvas.value.width, canvas.value.width);
        const inactiveRoutes = canvasDataStore().inactiveRoutes.filter((route) => route.routeVisuals.ifVisible && route.routeVisuals.ifShowPoints)
        drawContent(canvasContext, inactiveRoutes)
    } catch (error) {
        console.error(error)
    }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: CanvasRoute[]) {

    routes.forEach(route => {
        drawPoints(route, canvasContext)
    });
}

</script>

<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 1;
    pointer-events: none;
}
</style>
