<template>
  <div class="custom-select">
    <select @change="updateValue" class="custom-dropdown">
      <option disabled selected>Select your option</option>
      <option v-for="(choice, index) in props.options" :key="index" :value="choice">
        {{ choice }}
      </option>
    </select>
    <div class="select-arrow">
      <img src="../assets/images/select-arrow.png">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: String,
  options: Array
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
  const newValue = (event.target as HTMLSelectElement).value;
  emit('update:modelValue', newValue);
};
</script>
  
  
<style scoped>
.custom-select {
  display: flex;
  width: fit-content;
  position: relative;
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #232b2b;
  font-size: 16px;
  line-height: 1.5;
  padding: 10px;
  height: 40px;
  background-color: var(--vt-c-black-soft);
}

.custom-select select {
  width: 100%;
  height: 100%;
  appearance: none;
  background: transparent;
  border: none;
  outline: none;
  padding-right: 30px;
  cursor: pointer;
  color: var(--baseFg);
  text-overflow: ellipsis;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-justify: center;
}



.custom-select select::-ms-expand {
  display: none;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none;
}

.select-arrow img {
  display: block;
  width: 20px;
  height: 20px;
  pointer-events: none;
  filter: invert(1) sepia(100%) saturate(10000%) hue-rotate(45deg);
}

.custom-select:hover {
  border-color: var(--accentBg);
}

.custom-select select option {
  background-color: var(--vt-c-black-soft);
  color: var(--baseFg);
}
</style>