<template>
    <div class="container">
        <div class="line-container">
            <div class="line-option">
                <div class="line-option-container">
                    <p>Color</p>
                </div>
                <div class="line-option-container">
                    <ColorPicker v-model:pure-color="visual.color" @color-change="changeColorFormPicker" />
                </div>
            </div>
        </div>
        <div class="line-container">
            <div class="line-option">

                <div class="line-option-container">
                    <p>Size</p>
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
                    <ColorPicker v-model:pure-color="visual.strokeColor" @color-change="changeStrokeColorFormPicker" />
                </div>
            </div>
        </div>
        <div class="line-container">
            <div class="line-option">

                <div class="line-option-container">
                    <p>Stroke Width</p>
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
        <div class="line-container">
            <div class="line-option">

                <div class="line-option-container">
                    <p>X Offset</p>
                </div>

                <div class="line-option-container">
                    <p>{{ visual.xOffset }}px</p>
                </div>

                <div class="line-option-container">
                    <button class="increase-decrease-button" @click="visual.xOffset -= 2">←</button>
                    <button class="increase-decrease-button" @click="visual.xOffset += 2">→</button>
                </div>

            </div>
        </div>
        <div class="line-container">
            <div class="line-option">

                <div class="line-option-container">
                    <p>Y Offset</p>
                </div>

                <div class="line-option-container">
                    <p>{{ visual.yOffset }}px</p>
                </div>

                <div class="line-option-container">
                    <button class="increase-decrease-button" @click="visual.yOffset += 2">↓</button>
                    <button class="increase-decrease-button" @click="visual.yOffset -= 2">↑</button>
                </div>

            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
import type ITextVisual from '@/utils/Interfaces/Visuals/ITextVisual';
import type { PropType } from 'vue';
import ColorPicker from './ColorPicker.vue';

const visual = defineModel<ITextVisual>('visual', { required: true, type: Object as PropType<ITextVisual> })

function changeColorFormPicker(color: string) {
    visual.value.color = color
}

function changeStrokeColorFormPicker(color: string) {
    visual.value.strokeColor = color
}

</script>

<style scoped>
@import "../styles.css";
</style>