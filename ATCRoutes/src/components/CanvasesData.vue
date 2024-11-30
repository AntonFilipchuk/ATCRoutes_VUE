<template>
    <div>
        <div>
            <LinesCanvas :line-width="lineWidth" :canvas-heigh="canvasHeight" :canvas-width="canvasWidth"
                :routes="routes" />
            <PointsCanvas :point-width="pointWidth" :canvas-heigh="canvasHeight" :canvas-width="canvasWidth"
                :routes="routes" />
            <ActiveRouteCanvas ref="activeRouteCanvas" :line-width="lineWidth" :point-width="pointWidth"
                :canvas-heigh="canvasHeight" :canvas-width="canvasWidth" :route="activeRoute"
                @active-route-change="redrawCanvases" />
            <ConflictPointsCanvas ref="conflictPointsCanvas" :active-route="activeRoute" :routes="routes"
                :canvas-heigh="canvasHeight" :canvas-width="canvasWidth" :point-width="pointWidth" />
        </div>
        <div></div>
    </div>
</template>

<script setup lang="ts">
import type AIPRoute from '@/utils/Classes/AIPRoute/AIPRoute';
import type AIPRoutePoint from '@/utils/Classes/AIPRoute/AIPRoutePoint';
import GeographicCoordinate from '@/utils/Classes/GeographicCoordinate';
import Point from '@/utils/Classes/Point';
import Route from '@/utils/Classes/Route/Route';
import RoutePoint from '@/utils/Classes/Route/RoutePoint';
import type IBearingAndDistance from '@/utils/Interfaces/IBearingAndDistance';
import type ICartesianCoordinates from '@/utils/Interfaces/ICartesianCoordinates';
import calculateBearingAndDistance from '@/utils/Modules/bearingAndDistanceCalculator';
import calculateCartesianCoordinate from '@/utils/Modules/cartesianCoordinatesCalculator';
import normalizePoints from '@/utils/Modules/normalizePoints';
import PointsCanvas from './Canvases/PointsCanvas.vue';
import LinesCanvas from './Canvases/LinesCanvas.vue';
import ActiveRouteCanvas from './Canvases/ActiveRouteCanvas.vue';
import ConflictPointsCanvas from './Canvases/ConflictPointsCanvas.vue';
import { ref } from 'vue';
import { coordinatesStore } from '@/stores/coordinatesStore';
import { AIPRoutesStore } from '@/stores/AIPRoutesStore';
import { routesStore } from '@/stores/routesStore';
import { activeRouteStore, } from '@/stores/activeRouteStore';


const props = defineProps<{
    originPointName: string,
    magneticDeviation: number,
    useMagneticBearing: boolean,
}>();

const conflictPointsCanvas = ref<InstanceType<typeof ConflictPointsCanvas> | null>(null);

const canvasWidth: number = 2000
const canvasHeight: number = 2000
const pointWidth = 25;
const lineWidth = 15;


const coordinates = coordinatesStore().coordinates as GeographicCoordinate[];
const aipRoutes = AIPRoutesStore().routes as AIPRoute[];
const routes = routesStore().routes;
const activeRoute = activeRouteStore().activeRoute;

let points: Point[] = [];

const originCoordinate: GeographicCoordinate | undefined = coordinates.find(coordinate => {
    return coordinate.name === props.originPointName
})


if (!originCoordinate) {
    const errorMessage = `Can't find origin point: ${props.originPointName}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
}

coordinates.forEach((coordinate: GeographicCoordinate) => {
    const bearingAndDistance: IBearingAndDistance = calculateBearingAndDistance(originCoordinate, coordinate, props.magneticDeviation)
    const cartesianCoordinates: ICartesianCoordinates = calculateCartesianCoordinate(bearingAndDistance, props.useMagneticBearing)
    points.push(new Point(cartesianCoordinates.x, cartesianCoordinates.y, coordinate))
})

points = normalizePoints(points, canvasWidth, canvasHeight);

aipRoutes.forEach((route: AIPRoute) => {
    const routePoints: RoutePoint[] = []
    route.points.forEach((point: AIPRoutePoint) => {
        const p = points.find(p => p.name === point.name);
        if (!p) {
            throw new Error(`Can't find ${point.name} for ${route.name} route in points list!`)
        }
        routePoints.push(new RoutePoint(p.x, p.y, point.altitude, route.name, p.name));
    })
    routes.push(new Route(route.name, routePoints))
})


//TODO: move logic for selecting active route
setActiveRoute(routes[0]);

console.log("route", activeRouteStore().activeRoute);


function setActiveRoute(route: Route) {

    if (activeRoute && activeRoute !== route) {
        routes.push(activeRoute);
    }

    //Important to change the value through using the store to retain reactivity
    activeRouteStore().$patch({ activeRoute: route })

    const index = routes.indexOf(route);
    if (index > -1) {
        routes.splice(index, 1)
    }
}

function redrawCanvases() {
    if (conflictPointsCanvas.value) {
        conflictPointsCanvas.value.redrawConflictPoints();
    }
}
</script>


<style></style>