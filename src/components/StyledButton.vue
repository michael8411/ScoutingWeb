<template>
  <button
    :class="['button', btnClass]"
    :style="btnStyle"
    @click="handleClick"
    role="button"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  label: { type: String, default: 'Button' },
  btnClass: { type: String, default: '' },
  btnStyle: { type: Object, default: () => ({}) },
  onClick: { type: Function, default: null },
});

const btnStyle = ref(props.btnStyle);

const handleClick = (event: MouseEvent) => {
  if (props.onClick) {
    props.onClick(event);
  }
};

const computedStyle = computed(() => {
  return {
    '--button-height': '60px', // default height, can be overridden
    ...btnStyle.value,
  };
});
</script>
<style>
:root{
  --button-height: 52px;
}

.button {
  align-items: center;
  background-color: #009200;
  border: 2px solid #232b2b;
  border-radius: 15px;
  color: #111;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: var(--button-height);
  justify-content: center;
  justify-self: center;
  line-height: 24px;
  max-width: 100%;
  padding: 0 25px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  touch-action: manipulation;
  font-family: 'Lemon/Milk', 'Futura PT';
}
.button:after {
  background-color: #232b2b; /* Possible Culprit */
  border-radius: 15px;
  content: ""; /* Possible Culprit */
  display: block;
  height: var(--button-height);
  left: -1px;
  width: 100%;
  position: absolute;
  top: -3px;
  transform: translate(8px, 8px);
  transition: transform .2s ease-out; /* Possible Culprit */
  z-index: -1;
}

.button:hover:after {
  transform: translate(0, 0);
}

.button:active {
  background-color: var(--accentBg);
  outline: 0;
}

.button:hover {
  outline: 0;
}

@media (min-width: 768px) {
  .button {
    padding: 0 40px;
  }
}
</style>