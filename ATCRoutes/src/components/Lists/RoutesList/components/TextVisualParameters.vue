<template>
  <div class="container">
    <div class="row">
      <div class="option">
        <p>Color</p>
      </div>
      <div class="option">
        <ColorPicker v-model:pure-color="visual.color" @color-change="changeColorFormPicker" />
      </div>
    </div>
    <div class="row">
      <div class="option">
        <p>Size</p>
      </div>
      <div class="option">
        <p>{{ visual.width }}px</p>
      </div>
      <div class="option">
        <button class="increase-decrease-button" @click="visual.width += 2">+</button>
        <button class="increase-decrease-button" @click="visual.width -= 2">-</button>
      </div>
    </div>
    <div class="row">
      <div class="option">
        <p>Stroke</p>
      </div>
      <div class="option">&nbsp;</div>
      <div class="option">
        <input type="checkbox" v-model="visual.ifStroke" />
      </div>
    </div>
    <div class="row">
      <div class="option">
        <p>Stroke Color</p>
      </div>
      <div class="option">
        <ColorPicker
          v-model:pure-color="visual.strokeColor"
          @color-change="changeStrokeColorFormPicker"
        />
      </div>
    </div>
    <div class="row">
      <div class="option">
        <p>Stroke Width</p>
      </div>
      <div class="option">
        <p>{{ visual.strokeWidth }}px</p>
      </div>
      <div class="option">
        <button class="increase-decrease-button" @click="visual.strokeWidth += 2">+</button>
        <button class="increase-decrease-button" @click="visual.strokeWidth -= 2">-</button>
      </div>
    </div>
    <div class="row">
      <div class="option">
        <p>X Offset</p>
      </div>
      <div class="option">
        <p>{{ visual.xOffset }}px</p>
      </div>
      <div class="option">
        <button class="increase-decrease-button" @click="visual.xOffset -= 2">←</button>
        <button class="increase-decrease-button" @click="visual.xOffset += 2">→</button>
      </div>
    </div>
    <div class="row">
      <div class="option">
        <p>Y Offset</p>
      </div>
      <div class="option">
        <p>{{ visual.yOffset }}px</p>
      </div>
      <div class="option">
        <button class="increase-decrease-button" @click="visual.yOffset += 2">↓</button>
        <button class="increase-decrease-button" @click="visual.yOffset -= 2">↑</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type ITextVisual from '@/utils/Interfaces/Visuals/ITextVisual'
import type { PropType } from 'vue'
import ColorPicker from './ColorPicker.vue'

const visual = defineModel<ITextVisual>('visual', {
  required: true,
  type: Object as PropType<ITextVisual>,
})

function changeColorFormPicker(color: string) {
  visual.value.color = color
}

function changeStrokeColorFormPicker(color: string) {
  visual.value.strokeColor = color
}
</script>

<style scoped>
@import '../styles.css';
</style>
