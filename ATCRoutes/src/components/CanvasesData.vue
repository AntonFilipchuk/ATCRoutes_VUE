<template>
    <div>
        <div>
            <h1>Size: {{ canvasWidth }} by {{ canvasHeight }}</h1>
            <button @click="increaseCanvasSize" style="font-size: 32px;">Increase</button>
            <button @click="decreaseCanvasSize" style="font-size: 32px;">Decrease</button>
        </div>
        <div>
            <select style="font-size: 32px;" v-model="activeRoute">
                <option v-for="(route, index) in routes" :key="index" :value="route">
                    {{ route.name }}
                </option>
            </select>
        </div>
    </div>
    <div style="display: flex; flex-direction:row; align-items: stretch;">
        <div :style="canvasContainerStyle">
            <LinesCanvas />
            <PointsCanvas />
            <ActiveRouteCanvas />
            <!-- <ConflictPointsCanvas ref="conflictPointsCanvas" :active-route="activeRoute" :routes="routes"
                :canvas-heigh="canvasHeight" :canvas-width="canvasWidth" :point-width="pointWidth" />  -->
        </div>
        <div style="display: flex; flex: 1; position: relative;">
            <IntersectionsList />
        </div>
    </div>
</template>

<script setup lang="ts">
import type AIPRoute from '@/utils/Classes/AIPRoute/AIPRoute';
import GeographicCoordinate from '@/utils/Classes/GeographicCoordinate';
import LinesCanvas from './Canvases/LinesCanvas.vue';
import { computed, ref, type CSSProperties, type Ref } from 'vue';
import { coordinatesStore } from '@/stores/coordinatesStore';
import { AIPRoutesStore } from '@/stores/AIPRoutesStore';
import IntersectionsList from './IntersectionsList.vue';
import CanvasData from '@/utils/Classes/CanvasData';
import { canvasDataStore } from '@/stores/canvasDataStore';
import PointsCanvas from './Canvases/PointsCanvas.vue';
import type Route from '@/utils/Classes/Route/Route';
import ActiveRouteCanvas from './Canvases/ActiveRouteCanvas.vue';


const props = defineProps<{
    originPointName: string,
    magneticDeviation: number,
    useMagneticBearing: boolean,
}>();

const canvasWidth: Ref<number> = ref(800)
const canvasHeight: Ref<number> = ref(800)

const coordinates = coordinatesStore().coordinates as GeographicCoordinate[];
const aipRoutes = AIPRoutesStore().routes as AIPRoute[];

const originCoordinate: GeographicCoordinate | undefined = coordinates.find(coordinate => {
    return coordinate.name === props.originPointName
})

canvasDataStore().canvasData = new CanvasData(canvasWidth.value, canvasHeight.value, originCoordinate!, coordinates, aipRoutes, -11, true)

const routes = computed(() => canvasDataStore().canvasData!.allRoutes)

const activeRoute = computed({
    get() {
        return canvasDataStore().canvasData!.activeRoute
    },
    set(route: Route) {
        canvasDataStore().canvasData!.setActiveRoute(route)
    }
})


const canvasContainerStyle = computed((): CSSProperties => ({
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`,
    position: `relative`
}))


const increaseCanvasSize = () => {
    canvasWidth.value += 200;
    canvasHeight.value += 200;
    updateCanvasData()
}

const decreaseCanvasSize = () => {
    canvasWidth.value -= 200;
    canvasHeight.value -= 200;
    updateCanvasData()
}

function updateCanvasData() {
    const canvas = canvasDataStore().canvasData;
    canvas!.changeSize(canvasWidth.value, canvasHeight.value)
}

</script>


<style scoped></style>