<template>
    <div>
        <LinesCanvas :line-width="lineWidth" :canvas-heigh="props.canvasHeight" :canvas-width="props.canvasWidth"
            :routes="routes" />
        <PointsCanvas :point-width="pointWidth" :canvas-heigh="props.canvasHeight" :canvas-width="props.canvasWidth"
            :routes="routes" />
        <ActiveRouteCanvas :line-width="lineWidth" :point-width="pointWidth" :canvas-heigh="props.canvasHeight" :canvas-width="props.canvasWidth" :route="routes[0]" />
    </div>
</template>

<script setup lang="ts">
import type AIPRoute from '@/utils/Classes/AIPRoute/AIPRoute';
import type AIPRoutePoint from '@/utils/Classes/AIPRoute/AIPRoutePoint';
import type GeographicCoordinate from '@/utils/Classes/GeographicCoordinate';
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

const props = defineProps<{
    coordinates: GeographicCoordinate[],
    canvasWidth: number,
    canvasHeight: number,
    originPointName: string,
    magneticDeviation: number,
    useMagneticBearing: boolean,
    aipRoutes: AIPRoute[]
}>();

const pointWidth = 25;
const lineWidth = 15;

let points: Point[] = [];
const routes: Route[] = [];
const originCoordinate: GeographicCoordinate | undefined = props.coordinates.find(coordinate => {
    return coordinate.name === props.originPointName
})

if (!originCoordinate) {
    const errorMessage = `Can't find origin point: ${props.originPointName}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
}

props.coordinates.forEach((coordinate: GeographicCoordinate) => {
    const bearingAndDistance: IBearingAndDistance = calculateBearingAndDistance(originCoordinate, coordinate, props.magneticDeviation)
    const cartesianCoordinates: ICartesianCoordinates = calculateCartesianCoordinate(bearingAndDistance, props.useMagneticBearing)
    points.push(new Point(cartesianCoordinates.x, cartesianCoordinates.y, coordinate))
})

points = normalizePoints(points, props.canvasWidth, props.canvasHeight);

props.aipRoutes.forEach((route: AIPRoute) => {
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
</script>


<style></style>