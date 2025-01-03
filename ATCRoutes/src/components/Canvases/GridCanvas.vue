<template>
    <div>
        <canvas ref="gridCanvas" :style="{ 'z-index': zIndex }"></canvas>
    </div>
</template>
<script setup lang="ts">
import { canvasStore } from '@/stores/requests2/canvasStore';
import { drawLine } from '@/utils/Modules/drawer';
import getCanvasInfo, { setCanvasDimensions } from '@/utils/Modules/getCanvasInfo';
import { computed, onMounted, ref, watch } from 'vue';

defineProps({
    zIndex: { type: Number, required: true },
})

const gridCanvas = ref(null);
const canvas = computed(() => canvasStore())
let canvasContext: CanvasRenderingContext2D | undefined = undefined;
const watchedProperties = [computed(() => canvas.value.width), computed(() => canvas.value.height)]

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
    canvasContext = getCanvasInfo(gridCanvas.value).canvasContext;
    setCanvasDimensions(canvasContext, canvas.value.width, canvas.value.height)
    fillWithBackgroundColor(canvasContext)
    drawGrid(canvasContext, canvas.value.width, canvas.value.height)
}

function drawGrid(canvasContext: CanvasRenderingContext2D, width: number, height: number) {
    const top = { x: width / 2, y: 0 }
    const bottom = { x: width / 2, y: height }
    const left = { x: 0, y: height / 2 }
    const right = {
        x: width, y: height / 2
    }

    drawLine(top, bottom, "black", 1, canvasContext)
    drawLine(left, right, "black", 1, canvasContext)
}

function fillWithBackgroundColor(canvasContext: CanvasRenderingContext2D) {
    canvasContext.fillStyle = "lightgray"
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height)
}
</script>
<style scoped>

canvas {
    outline: black 3px solid;
    pointer-events: none;
}
</style>