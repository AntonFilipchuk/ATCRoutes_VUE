<template>
    <div class="container">
        <div class="line-container">
            <div class="line-option">
                <div class="line-option-container">
                    <p>Color</p>
                </div>
                <div class="line-option-container">
                    <div class="color-display" :style="{
                        'background-color': visual.color
                    }">&nbsp;</div>
                </div>
                <div class="line-option-container">
                    <button @click="changeColor(visual)">
                        Change
                    </button>
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
                    <div class="color-display" :style="{
                        'background-color': visual.strokeColor
                    }">&nbsp;</div>
                </div>
                <div class="line-option-container">
                    <button @click="changeStrokeColor(visual)">
                        Change
                    </button>
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
                    <button class="increase-decrease-button" @click="visual.xOffset += 2">+</button>
                    <button class="increase-decrease-button" @click="visual.xOffset -= 2">-</button>
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
                    <button class="increase-decrease-button" @click="visual.yOffset += 2">+</button>
                    <button class="increase-decrease-button" @click="visual.yOffset -= 2">-</button>
                </div>

            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
import type ITextVisual from '@/utils/Interfaces/Visuals/ITextVisual';
import { getRandomColor } from '@/utils/Modules/randomColorGenerator';
import type { PropType } from 'vue';

const visual = defineModel<ITextVisual>('visual', { required: true, type: Object as PropType<ITextVisual> })


function changeColor(visual: ITextVisual) {
    visual.color = getRandomColor()
}

function changeStrokeColor(visual: ITextVisual) {
    visual.strokeColor = getRandomColor()
}


</script>



<style>
.container .line-container:nth-child(even) {
    background-color: rgb(183, 183, 183)
}

.container .line-container:nth-child(odd) {
    background-color: rgb(233, 233, 233)
}

.line-container {
    display: flex;
    flex-direction: column;
}

.line-container .line-option {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between
}

.line-container .line-option .line-option-container {
    flex: 1 1 0px;
    display: flex;
    justify-content: center;
    align-items: center
}

button {
    padding: 6px;
    margin: 0;
    color: white;
    background-color: #0060df;
}

button h1 {
    padding: 0;
    margin: 0;
}

.increase-decrease-button {
    min-width: 30px;
    min-height: 30px;
}

.color-display {
    width: 100%;
    height: 100%;
}

p {
    margin: 0;
    padding: 0
}
</style>