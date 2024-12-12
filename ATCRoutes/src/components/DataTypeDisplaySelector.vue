<template>
    <div class="container">
        <div class="buttons-container">
            <div v-for="(button, index) in buttons" :key="index" :class="{
                active: selectedButton === button.id,
                inactive: selectedButton !== button.id
            }" @click="selectButton(button.id)">
                <h1>{{ button.label }}</h1>
            </div>
        </div>
        <div>
            <div v-if="selectedButton === 'routes'">
                <RoutesList />
            </div>
            <div v-if="selectedButton === 'intersections'">
                <IntersectionsList />
            </div>
            <div v-if="selectedButton === 'aipRoutes'">AIP Routes Content</div>
            <div v-if="selectedButton === 'coordinates'">Coordinates Content</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import RoutesList from './Lists/RoutesList/RoutesList.vue';
import IntersectionsList from './Lists/IntersectionsList.vue';


const buttons = [
    { id: 'routes', label: 'Routes' },
    { id: 'intersections', label: 'Intersections' },
    { id: 'aipRoutes', label: 'AIP Routes' },
    { id: 'coordinates', label: 'Coordinates' },
]

const selectedButton = ref(buttons[1].id)

function selectButton(id: string) {
    selectedButton.value = id
}

</script>
<style scoped>
.container {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.buttons-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border: solid black;
    border-bottom: none;
}

.buttons-container div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
}

.buttons-container div.active {
    outline: 6px double white;
    outline-offset: -6px;
    background-color: #007bff;
    color: white;
}

.buttons-container div.inactive {
    background-color: rgb(229, 229, 229);
    color: rgb(164, 164, 164);
}
</style>