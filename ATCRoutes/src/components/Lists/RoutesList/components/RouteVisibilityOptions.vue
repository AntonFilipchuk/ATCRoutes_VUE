<template>
    <div class="show-container">
        <div class="show-option">
            <p>All</p> <input type="checkbox" v-model="route.routeVisuals.ifVisible">
        </div>
        <div class="show-option">
            <p>Text</p> <input type="checkbox" v-model="route.routeVisuals.ifShowText">
        </div>
        <div class="show-option">
            <p>Lines</p> <input type="checkbox" v-model="route.routeVisuals.ifShowLines">
        </div>
        <div class="show-option">
            <p>Points</p> <input type="checkbox" v-model="route.routeVisuals.ifShowPoints">
        </div>
    </div>
</template>
<script setup lang="ts">
import type CanvasRoute from '@/utils/Classes/CanvasRoute/CanvasRoute';
import type { PropType } from 'vue';

const route = defineModel<CanvasRoute>('route', { required: true, type: Object as PropType<CanvasRoute> })

</script>
<style scoped>
.show-container {
    display: flex;
    flex-direction: column;
}

.show-container .show-option:nth-child(even) {
    background-color: rgb(183, 183, 183)
}

.show-container .show-option:nth-child(odd) {
    background-color: rgb(233, 233, 233)
}

.show-container .show-option {
    padding: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between
}

input {
    padding: 0;
    margin: 0;
    min-width: 25px;
    min-height: 25px;
}
</style>