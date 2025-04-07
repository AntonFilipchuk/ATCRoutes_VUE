<template>
  <div class="container">
    <div class="row">
      <div class="option">
        <p>Color</p>
      </div>
      <div class="option">
        <ColorPicker v-model:pure-color="visual.color" @color-change="changeColorFromPicker" />
      </div>
    </div>
    <div class="row">
      <div class="option">
        <p>Width</p>
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
          @color-change="changeStrokeColorFromPicker"
        />
      </div>
    </div>
    <div class="row">
      <div class="option">
        <p>Stroke width</p>
      </div>
      <div class="option">
        <p>{{ visual.strokeWidth }}px</p>
      </div>
      <div class="option">
        <button class="increase-decrease-button" @click="visual.strokeWidth += 2">+</button>
        <button class="increase-decrease-button" @click="visual.strokeWidth -= 2">-</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type IVisual from '@/utils/Interfaces/Visuals/IVisual'
import type { PropType } from 'vue'
import ColorPicker from './ColorPicker.vue'

const visual = defineModel<IVisual>('visual', { required: true, type: Object as PropType<IVisual> })

function changeColorFromPicker(color: string) {
  visual.value.color = color
}

function changeStrokeColorFromPicker(color: string) {
  visual.value.strokeColor = color
}
</script>

<style scoped>
@import '../styles.css';
</style>
