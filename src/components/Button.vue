<script setup>
const props = defineProps({
  label: { type: String, required: false },
  href: { type: String, required: false },
  onClick: { type: Function, required: false }
});
</script>

<template>
  <button :href="props.href" @click="props.onClick()" class="button" role="button">{{ props.label }}</button>
</template>

<style>
:root{
  --button-height: 52px;
}

.button {
  align-items: center;
  background-color: #009200;
  border: 2px solid #232b2b;
  border-radius: 8px;
  box-sizing: border-box;
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
  -webkit-user-select: none;
  touch-action: manipulation;
  font-family: 'Lemon/Milk', 'Futura PT';
}

.button:after {
  background-color: #232b2b;
  border-radius: 8px;
  content: "";
  display: block;
  height: var(--button-height);
  left: 0;
  width: 100%;
  position: absolute;
  top: -2px;
  transform: translate(8px, 8px);
  transition: transform .2s ease-out;
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