<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>
<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore';
import { drawLine } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref, watch } from 'vue';


const canvas = ref(null);
const canvasStore = computed(() => canvasDataStore())
let canvasContext: CanvasRenderingContext2D | undefined = undefined;
const watchedProperties = [computed(() => canvasStore.value.canvasData?.width), computed(() => canvasStore.value.canvasData?.height)]

watch(watchedProperties, () => {
    renderCanvas()
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
    setCanvasDimensions(canvasContext, canvasStore.value.canvasData!.width, canvasStore.value.canvasData!.height)
    drawGrid(canvasContext)
}

function drawGrid(canvasContext: CanvasRenderingContext2D) {
    const width = canvasStore.value.canvasData?.width
    const height = canvasStore.value.canvasData?.height

    if (!width || !height) {
        throw new Error("Can't access width or height of a canvas")
    }
    const top = { x: width / 2, y: 0 }
    const bottom = { x: width / 2, y: height }
    const left = { x: 0, y: height / 2 }
    const right = {
        x: width, y: height / 2
    }

    drawLine(top, bottom, "black", 1, canvasContext)
    drawLine(left, right, "black", 1, canvasContext)
}
</script>
<style scoped>
canvas {
    z-index: -1;
    outline: black 3px solid;
}
</style>