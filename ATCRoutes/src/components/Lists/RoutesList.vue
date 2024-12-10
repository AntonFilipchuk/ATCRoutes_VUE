<!-- eslint-disable vue/no-parsing-error -->
<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Show Route</th>
                    <th scope="col">Show Text</th>
                    <th scope="col">Line color</th>
                    <th scope="col">Line width</th>
                    <th scope="col">Point color</th>
                    <th scope="col">Point width</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="activeRoute">
                    <th>{{ activeRoute.name }}</th>
                    <td> <input type="checkbox" v-model="activeRoute.ifVisible"></td>
                    <td> <input type="checkbox" v-model="activeRoute.ifShowText"></td>
                    <td>
                        <div :style="{
                            'background-color': activeRoute.lineColor
                        }">&nbsp</div>
                    </td>
                    <td>
                        <div>{{ activeRoute.lineWidth }} <button>+</button> <button>-</button></div>
                    </td>
                    <td>
                        <div :style="{
                            'background-color': activeRoute.pointColor
                        }">&nbsp</div>
                    </td>
                    <td>{{ activeRoute.pointWidth }}</td>
                </tr>
                <tr v-for="(route, index) in inactiveRoutes" :key="index">
                    <th>{{ route.name }}</th>
                    <td> <input type="checkbox" v-model="route.ifVisible"></td>
                    <td> <input type="checkbox" v-model="route.ifShowText"></td>
                    <td>
                        <div :style="{
                            'background-color': route.lineColor
                        }">&nbsp</div>
                    </td>
                    <td>
                        <div>{{ route.lineWidth }}px
                            <button @click="route.lineWidth += 2">+</button>
                            <button @click="route.lineWidth -= 2">-</button>
                        </div>
                    </td>
                    <td>
                        <div :style="{
                            'background-color': route.pointColor
                        }">&nbsp</div>
                    </td>
                    <td>{{ route.pointWidth }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import { canvasDataStore } from '@/stores/canvasDataStore';
import { computed } from 'vue';
const activeRoute = computed(() => canvasDataStore().activeRoute)
const inactiveRoutes = computed(() => canvasDataStore().inactiveRoutes);
</script>
<style scoped>
table {
    width: 100%;
    font-size: 28px;
}

table th,
td {
    padding: 0;
    text-align: center;
}

td div {
    width: 100%;
    height: 100%;
    min-height: 10px;
}
</style>