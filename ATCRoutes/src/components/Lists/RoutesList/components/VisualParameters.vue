<template>
    <div class="container">
        <div class="line-container">
            <div class="line-option">
                <div class="line-option-container">
                    <p>Color</p>
                </div>
                <div class="line-option-container">
                    <ColorPicker v-model:pure-color="visual.color" @color-change="changeColorFromPicker" />
                </div>
            </div>
        </div>
        <div class="line-container">
            <div class="line-option">

                <div class="line-option-container">
                    <p>Width</p>
                </div>

                <div class="line-option-container">
                    <p>{{ visual.width }}px</p>
                </div>


                <div class="line-option-container">
                    <button class="increase-decrease-button" @click="visual.width += 2">
                        +
                    </button>
                    <button class="increase-decrease-button" @click="visual.width -= 2">
                        -
                    </button>
                </div>

            </div>
        </div>
        <div class="line-container">
            <div class="line-option">

                <div class="line-option-container">
                    <p>Stroke</p>
                </div>

                <div class="line-option-container"> &nbsp;</div>

                <div class="line-option-container">
                    <input type="checkbox" v-model="visual.ifStroke">
                </div>

            </div>
        </div>
        <div class="line-container">
            <div class="line-option">
                <div class="line-option-container">
                    <p>Stroke Color</p>
                </div>
                <div class="line-option-container">
                    <ColorPicker v-model:pure-color="visual.strokeColor" @color-change="changeStrokeColorFromPicker" />
                </div>
            </div>
        </div>
        <div class="line-container">
            <div class="line-option">

                <div class="line-option-container">
                    <p>Stroke width</p>
                </div>

                <div class="line-option-container">
                    <p>{{ visual.strokeWidth }}px</p>
                </div>

                <div class="line-option-container">
                    <button class="increase-decrease-button" @click="visual.strokeWidth += 2">+</button>
                    <button class="increase-decrease-button" @click="visual.strokeWidth -= 2">-</button>
                </div>

            </div>
        </div>
    </div>

</template>



<script setup lang="ts">
import type IVisual from '@/utils/Interfaces/Visuals/IVisual';
import type { PropType } from 'vue';
import ColorPicker from './ColorPicker.vue';

const visual = defineModel<IVisual>('visual', { required: true, type: Object as PropType<IVisual> })

function changeColorFromPicker(color: string) {
    visual.value.color = color
}

function changeStrokeColorFromPicker(color: string) {
    visual.value.strokeColor = color
}

</script>



<style scoped>
@import "../styles.css";
</style>