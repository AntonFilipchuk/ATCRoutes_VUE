<template>
  <div style="display: flex; flex: 1 1 0px">
    <color-picker
      v-model:pureColor="pureColor"
      useType="pure"
      shape="square"
      pickerType="fk"
      lang="En"
      :pureColorChange="onColorChange"
      :isWidget="false"
    />
  </div>
</template>
<script setup lang="ts">
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
const pureColor = defineModel<string>('pureColor', { required: true, type: String })

function onColorChange() {
  emit('colorChange', pureColor.value)
}

const emit = defineEmits<{
  (e: 'colorChange', color: string): void
}>()
</script>
<style>
.vc-color-wrap[data-v-354ca836] {
  display: flex;
  flex: 1 1 100%;
  margin: 0;
  padding: 0;
}
</style>
