<template>
    <div>
        <canvas ref="textCanvas" :style="{ 'z-index': zIndex }"></canvas>
    </div>
</template>

<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore';
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute';
import { DrawCanvasRouteText } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref, watch, } from 'vue';


defineProps({
    zIndex: { type: Number, required: true },
})

const textCanvas = ref(null)
const canvasStore = computed(() => canvasDataStore())

onMounted(() => {
    renderCanvas();
});

const watchedRoutesVisualProps = computed(() => canvasStore.value.inactiveRoutes.map((route) => {
    return {
        ifVisible: route.routeVisuals.ifVisible,
        ifShowText: route.routeVisuals.ifShowText,
        ...route.routeVisuals.textVisuals
    }
}))

watch([
    computed<number>(() => canvasStore.value.width),
    computed<number>(() => canvasStore.value.height),
    watchedRoutesVisualProps],
    () => { renderCanvas() }
)

function renderCanvas() {
    try {
        const canvasContext = getCanvasInfo(textCanvas.value).canvasContext;
        setCanvasDimensions(canvasContext, canvasStore.value.width, canvasStore.value.height);
        const routes = canvasStore.value.inactiveRoutes.filter((route) => route.routeVisuals.ifVisible && route.routeVisuals.ifShowText)
        drawContent(canvasContext, routes);
    } catch (error) {
        console.error(error);
    }
}

function drawContent(canvasContext: CanvasRenderingContext2D, routes: CanvasRoute[]) {
    routes.forEach(route => {
        DrawCanvasRouteText(route, canvasContext)
    });
}

</script>

<style scoped>
canvas {
    left: 0;
    top: 0;
    pointer-events: none;
}
</style>