<template>
  <div class="input-field">
    <label :for="id" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :id="id"
        :type="inputType"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        class="input-control"
        :class="{ 'show-password': hidePassword }"
        required
      />
      <label
        v-if="hideText"
        :for="'show-password-' + id"
        class="toggle-password"
        @click="togglePasswordVisibility"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="32"
          height="32"
          class="svg-toggle-password"
          :class="{ 'visible': hidePassword }"
          title="Toggle Password Security"
        >
          <title>Hide/Show Password</title>
          <path
            d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z"
          />
          <rect
            x="20.133"
            y="2.117"
            height="44"
            transform="translate(23 -8.5) rotate(45)"
            class="closed-eye"
          />
          <rect
            x="22"
            y="3.984"
            width="4"
            height="44"
            transform="translate(25 -9.5) rotate(45)"
            style="fill: #c0c0c0"
            class="closed-eye"
          />
        </svg>
      </label>
    </div>
    <div class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';

interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  modelValue: string;
  errorMessage?: string;
  hideText?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

const hidePassword = ref(false);

const inputType = computed(() => {
  return hidePassword.value ? 'password' : 'text';
});

const togglePasswordVisibility = () => {
  hidePassword.value = !hidePassword.value;
};
</script>

<style scoped>
.input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.svg-toggle-password {
  fill: #6c6c6c;
  height: 24px;
  transition: fill 0.3s ease;
  display: flex;
  align-items: center;
  align-content: center;
  
}

.svg-toggle-password:hover {
  fill: #ffffff;
}

.svg-toggle-password .closed-eye {
  opacity: 0.5;
  height: 0;
  transition: opacity 400ms linear, height 400ms linear;
  fill: black;
}

.svg-toggle-password.visible .closed-eye {
  opacity: 0.7;
  transition: opacity 300ms ease, height 400ms ease;
  width: 4px;
  height: 44px;
  fill: black;
}

.input-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  width: 100%;
}

.input-label {
  font-family: 'Poppins-Black', sans-serif;
  font-size: 18px;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.input-control {
  width: 100%;
  padding: 16px;
  font-family: 'Poppins-SemiBold', sans-serif;
  font-size: 20px;
  color: #ffffff;
  background-color: #131313;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
}

.input-control:focus {
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.2);
}

.input-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.error-message {
  color: #ff4d4d;
  font-size: 14px;
  margin-top: 0.5rem;
}
</style>