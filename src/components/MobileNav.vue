<template>
  <div class="mobile-nav">
    <div class="tabs">
      <!-- TAB 1 -->
      <input type="radio" name="tab" id="tab-01" v-model="selectedTab" value="tab-01" />
      <label for="tab-01">
        <svg viewBox="0 0 25 25">
          <use xlink:href="#icon-01" class="icon" />
          <use xlink:href="#icon-01" class="icon" />
          <use xlink:href="#icon-01" class="icon" />
          <use xlink:href="#icon-01" class="icon" />
          <use xlink:href="#icon-01" class="icon" />
        </svg>
      </label>
      <!-- TAB 2 -->
      <input type="radio" name="tab" id="tab-02" v-model="selectedTab" value="tab-02" />
      <label for="tab-02">
        <svg viewBox="0 0 25 25">
          <use xlink:href="#icon-02" class="icon" />
          <use xlink:href="#icon-02" class="icon" />
          <use xlink:href="#icon-02" class="icon" />
          <use xlink:href="#icon-02" class="icon" />
          <use xlink:href="#icon-02" class="icon" />
        </svg>
      </label>
      <!-- TAB 3 -->
      <input type="radio" name="tab" id="tab-03" v-model="selectedTab" value="tab-03" />
      <label for="tab-03">
        <svg viewBox="0 0 25 25">
          <use xlink:href="#icon-03" class="icon" />
          <use xlink:href="#icon-03" class="icon" />
          <use xlink:href="#icon-03" class="icon" />
          <use xlink:href="#icon-03" class="icon" />
          <use xlink:href="#icon-03" class="icon" />
        </svg>
      </label>
      <!-- TAB 4 -->
      <input type="radio" name="tab" id="tab-04" v-model="selectedTab" value="tab-04" />
      <label for="tab-04">
        <svg viewBox="0 0 25 25">
          <use xlink:href="#icon-04" class="icon" />
          <use xlink:href="#icon-04" class="icon" />
          <use xlink:href="#icon-04" class="icon" />
          <use xlink:href="#icon-04" class="icon" />
          <use xlink:href="#icon-04" class="icon" />
        </svg>
      </label>
    </div>

    <!-- SVG -->
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
      <symbol id="icon-01" viewBox="0 0 25 25">
        <path
          d="M9.82,1.5A11.13,11.13,0,0,0,1.5,12.33a11.08,11.08,0,0,0,11,11.17,11.08,11.08,0,0,0,11-11.17A11.16,11.16,0,0,0,16.33,1.86V12.33a3.9,3.9,0,1,1-.08-.78"
        />
      </symbol>
      <symbol id="icon-02" viewBox="0 0 25 25">
        <path
          d="M18.16,23.5h2.16a3.19,3.19,0,0,0,3.18-3.18V4.68A3.19,3.19,0,0,0,20.32,1.5H8.81l0,4.19A3.15,3.15,0,1,1,5.69,8.83H1.5V20.32A3.19,3.19,0,0,0,4.68,23.5h8.83s-.49-5.76,4.75-8.38"
        />
      </symbol>
      <symbol id="icon-03" viewBox="0 0 25 25">
        <path
          d="M14.6,5.13V4.68A3.19,3.19,0,0,0,11.42,1.5H4.68A3.19,3.19,0,0,0,1.5,4.68V20.32A3.19,3.19,0,0,0,4.68,23.5H20.32a3.19,3.19,0,0,0,3.18-3.18V12.53a3.19,3.19,0,0,0-3.18-3.17H6.77"
        />
      </symbol>
      <symbol id="icon-04" viewBox="0 0 25 25">
        <path d="M4,23.5a11,11,0,0,1,17,0" />
        <path d="M15.66,10.5a3.16,3.16,0,0,1-6.32,0H3.5a9,9,0,1,1,2.87,6.59" />
      </symbol>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      selectedTab: 'tab-01'
    }
  },
  watch: {
    selectedTab(newTab: string) {
      // Emit an event when the selected tab changes
      this.$emit('tab-changed', newTab)
    }
  }
})
</script>

<style scoped>
.tabs {
  --background: rgba(0, 0, 0, 0.8);
  --text-color: #e0e0e0;
  --color-01: #4caf50;
  --color-02: #388e3c;
  --color-03: #1b5e20;
  --border-radius: 10px;
  background: var(--background);
  width: 100%;
  height: 60px;
  padding: 0;
  position: relative;
  border-radius: var(--border-radius);
  box-shadow: 0 8px 32px 0 rgba(83, 83, 83, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
}

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

label {
  width: 20%;
  height: 100%;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

label::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  background: var(--color-01);
  border-radius: 50%;
  opacity: var(--opacity, 0);
  transform: scale(0);
}

label svg {
  width: 25px;
  height: 25px;
}


label svg .icon {
  fill: none;
  stroke: var(--text-color);
  stroke-dashoffset: 98;
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

label svg .icon:nth-child(2) {
  opacity: 0;
  stroke: var(--color-01);
  animation-delay: 0.1s !important;
}

label svg .icon:nth-child(3) {
  opacity: 0;
  stroke: var(--color-02);
  animation-delay: 0.2s !important;
}

label svg .icon:nth-child(4) {
  opacity: 0;
  stroke: var(--color-03);
  animation-delay: 0.3s !important;
}

label svg .icon:nth-child(5) {
  opacity: 0;
  stroke: var(--color-01);
  animation-delay: 0.4s !important;
}

input {
  display: none;
}

input:checked + label::before {
  animation: click-animation 0.4s ease forwards;
}

input:checked + label svg .icon:first-child {
  animation: stroke-animation-first 0.5s linear forwards 0.5s;
}

input:checked + label svg .icon:nth-child(2) {
  animation: stroke-animation 0.5s linear forwards;
}

input:checked + label svg .icon:nth-child(3) {
  animation: stroke-animation 0.5s linear forwards;
}

input:checked + label svg .icon:nth-child(4) {
  animation: stroke-animation 0.5s linear forwards;
}

input:checked + label svg .icon:last-child {
  animation: stroke-animation-last 0.5s linear forwards;
}

@keyframes stroke-animation-first {
  0% {
    opacity: 1;
    stroke-dashoffset: 98;
    stroke-dasharray: 98 0;
  }
  100% {
    opacity: 0;
    stroke-dashoffset: 0;
    stroke-dasharray: 0 98;
  }
}

@keyframes stroke-animation {
  0% {
    opacity: 1;
    stroke-dashoffset: 98;
    stroke-dasharray: 0 98 0 0;
  }
  15% {
    stroke-dasharray: 0 98 18 0;
  }
  100% {
    opacity: 1;
    stroke-dashoffset: 0;
    stroke-dasharray: 0 98 18 0;
  }
}

@keyframes stroke-animation-last {
  0% {
    opacity: 1;
    stroke-dashoffset: 98;
    stroke-dasharray: 98 98 18 0;
  }
  15% {
    stroke-dasharray: 116 98 18 0;
  }
  100% {
    opacity: 1;
    stroke-dashoffset: 0;
    stroke-dasharray: 116 98 18 0;
  }
}

@keyframes click-animation {
  50% {
    transform: scale(4);
    opacity: 0.1;
  }
}
</style>
