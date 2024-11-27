<template>
    <h1>Loader</h1>
    <div v-if="loading">Loading data</div>
    <div v-if="!loading">
        <div v-if="errorMessage">
            {{ errorMessage }}
        </div>
        <div v-if="!errorMessage">
            <CanvasesContainer :coordinates="coordinates" :canvasHeight=3000 :canvasWidth=3000 :magnetic-deviation=-11
                :use-magnetic-bearing=true origin-point-name="rw06" :aip-routes=AIPRoutes />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import GeographicCoordinate from '@/utils/Classes/GeographicCoordinate';
import type IGeographicalCoordinate from '@/utils/Interfaces/IGeographicalCoordinate';
import CanvasesContainer from './CanvasesContainer.vue';
import AIPRoutePoint from '@/utils/Classes/AIPRoute/AIPRoutePoint';
import AIPRoute from '@/utils/Classes/AIPRoute/AIPRoute';

const coordinatesPath = "/coordinates.json";
const AIPRoutesPath = "/AIPRoutes.json"

const loading = ref(true);

let coordinates: GeographicCoordinate[] = [];
const AIPRoutes: AIPRoute[] = [];
let errorMessage: string | null = null;

onMounted(async () => await load());

async function load() {
    try {
        const coordinatesResponse = await fetch(coordinatesPath);
        const AIPRoutesResponse = await fetch(AIPRoutesPath)

        if (!coordinatesResponse.ok) {
            throw new Error("Error fetching coordinates data!");
        }

        if (!AIPRoutesResponse.ok) {
            throw new Error("Error fetching AIP routes data!");
        }

        const coordinatesJSON = await coordinatesResponse.json();
        const AIPRoutesJSON = await AIPRoutesResponse.json();

        if (coordinatesJSON.coordinates && coordinatesJSON.coordinates.length > 0) {
            coordinates = coordinatesJSON.coordinates.map((coordinate: IGeographicalCoordinate) => {
                return new GeographicCoordinate(coordinate.name, coordinate.latitude, coordinate.longitude);
            })
        } else {
            errorMessage = "No coordinates found.";
            throw new Error(errorMessage);
        }

        if (AIPRoutesJSON.routes) {
            AIPRoutesJSON.routes.forEach((route: { points: { name: string; altitude: number; }[]; name: string; id: number; }) => {
                const aipPoints = route.points.map(point => new AIPRoutePoint(point.name, point.altitude))
                AIPRoutes.push(new AIPRoute(route.name, route.id, aipPoints))
            }
            )
        }
        else {
            errorMessage = "No AIP routes found"
            throw new Error(errorMessage);
        }

    } catch (error) {
        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "Error fetching data!";
        }
    } finally {
        loading.value = false;
    }
}
</script>
