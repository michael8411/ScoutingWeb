<!-- Graphic Section Component -->

<template>
  <aside class="graphic-section">
    <div class="graphic-container">
      <img class="glitch-logo" src="@/assets/images/624Glow.png" alt="Glitch Logo" />
      <div class="background-overlay"></div>
    </div>
  </aside>
</template>
<script setup lang="ts"></script>

<style scoped>
.graphic-section {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 50%;
  background-color: rgba(0, 0, 0, 0.45);
  justify-content: center;
  align-items: center;
  border-radius: 0px 30px 30px 0px;
  z-index: 1;
}

.graphic-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.7;
  background: url('@/assets/images/BlurredBackground.png') rgb(0, 0, 0) 90% / cover no-repeat;
  filter: blur(5px) brightness(50%);
  z-index: 0;
  animation: breathingBlur 5s ease-in-out infinite;
}

@keyframes breathingBlur {
  0%,
  100% {
    filter: blur(10px) brightness(50%);
  }
  50% {
    filter: blur(70px) brightness(50%);
  }
}

/* Graphic Container Styles */
.graphic-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Glitch Logo Styles */
.glitch-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  max-height: 80%;
  width: auto;
  height: auto;
  z-index: 1;
}

/* Background Overlay Styles */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.056);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  z-index: 0;
}

/* Responsive Styles */

/* Extra Small Devices Styling */
.xs .graphic-section {
  display: none;
}

/* Small Devices Styling */
.sm .graphic-section {
  display: none;
}

/* Medium Devices Styling */
.md .graphic-section {
  display: none;
}

/* Large Devices Styling */
.lg .graphic-section {
  display: block;
  width: 50%;
  height: 100%;
  border-radius: 0px 30px 30px 0px;
}

.lg .graphic-container {
  width: 100%;
  height: 100%;
}

.lg .glitch-logo {
  max-width: 80%;
  max-height: 80%;
}

.lg .background-overlay {
  width: 100%;
  height: 100%;
}

/* Extra Large Devices Styling */
.xl .graphic-section {
  display: block;
  width: 50%;
  height: 100%;
  border-radius: 0px 30px 30px 0px;
}

.xl .graphic-container {
  width: 100%;
  height: 100%;
}

.xl .glitch-logo {
  max-width: 80%;
  max-height: 80%;
}

.xl .background-overlay {
  width: 100%;
  height: 100%;
}

/* Extra Extra Large Devices Styling */
.xxl .graphic-section {
  display: block;
  width: 50%;
  height: 100%;
  border-radius: 0px 30px 30px 0px;
}

.xxl .graphic-container {
  width: 100%;
  height: 100%;
}

.xxl .glitch-logo {
  max-width: 80%;
  max-height: 80%;
}

.xxl .background-overlay {
  width: 100%;
  height: 100%;
}
</style>
