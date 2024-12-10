<template>
    <div>
        <canvas ref="linesCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore';
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute';
import drawRouteLines from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref, watch, } from 'vue';

const linesCanvas = ref(null)
const canvasStore = computed(() => canvasDataStore())
const watchedProperties = [
    computed(() => canvasStore.value.width),
    computed(() => canvasStore.value.height),
    computed(() => canvasStore.value.activeRoute)
]

const watchedRoutesVisualProps = computed(() => canvasStore.value.inactiveRoutes.map((route) => {
    return {
        ifVisible: route.ifVisible,
        linesWidth: route.lineWidth,
        lineColor: route.lineColor,
    }
}))

watch([...watchedProperties, watchedRoutesVisualProps], () => { renderCanvas() })

onMounted(() => {
    renderCanvas();
});


function renderCanvas() {
    try {
        const canvasContext = getCanvasInfo(linesCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height);
        const routes = canvasStore.value.inactiveRoutes.filter((route) => route.ifVisible)
        drawContent(canvasContext, routes);
    } catch (error) {
        console.error(error);
    }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: CanvasRoute[]) {
    routes.forEach(route => {
        drawRouteLines(route, canvasContext);
    });
}

</script>

<style scoped>
canvas {
    /* position: absolute; */
    left: 0;
    top: 0;
    z-index: 0;
    pointer-events: none;
}
</style>