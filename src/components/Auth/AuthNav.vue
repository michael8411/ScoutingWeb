<!-- AuthNav.vue -->
<template>
  <div class="nav">
    <ul class="links">
      <li :class="{ 'signin-active': isSignIn }" @click="$emit('toggleForm', true)">
        <a class="signin-btn">Sign in</a>
      </li>
      <li :class="{ 'signup-active': !isSignIn }" @click="$emit('toggleForm', false)">
        <a class="signup-btn">Sign up</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  isSignIn: Boolean
})
</script>

<style scoped>
/* Font Styles */
@font-face {
  font-family: 'Poppins-Thin';
  src: url('@/assets/fonts/Poppins/Poppins-Thin.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

/* Global Styles */
*,
*:after,
*:before {
  box-sizing: border-box;
  font-family: 'Poppins-Thin', sans-serif;
  font-size: 30px;
  font-weight: 400;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Navigation Styles */
.nav {
  align-self: flex-start;
  width: 100%;
  padding-left: 0px;
  flex: 0 0 auto;
  margin-right: auto;
}

.nav ul.links {
  display: flex;
  flex-direction: row;
  list-style: none;
  gap: 40px;
  padding: 0;
  font-family: 'Poppins-Light', sans-serif;
  font-size: 25px;
  justify-content: flex-start;
}

.nav a {
  text-decoration: none;
  color: #6c6c6c;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: transparent;
  opacity: 0.5;
  font-size: 30px;
  font-weight: bold;
}

.nav a::after {
  content: '';
  display: flex;
  margin: auto;
  height: 3px;
  width: 0px;
  background: transparent;
  transition: width 0.5s ease, background-color 0.5s ease;
}

/* Navigation Active State */
.nav .links li.signin-active a.signin-btn,
.nav .links li.signup-active a.signup-btn {
  opacity: 1;
  padding-bottom: 15%;
}

.nav .links li.signin-active a.signin-btn::after,
.nav .links li.signup-active a.signup-btn::after {
  background-color: #6b6b6b;
  width: 100%;
}

/* Responsive Styles */

/* Extra Small Devices Styling */
.xs .nav ul.links {
  gap: 20px;
  font-size: 20px;
}

.xs .nav a {
  font-size: 24px;
}

/* Small Devices Styling */
.sm .nav ul.links {
  gap: 25px;
  font-size: 22px;
}

.sm .nav a {
  font-size: 26px;
}

/* Medium Devices Styling */
.md .nav ul.links {
  gap: 30px;
  font-size: 24px;
}

.md .nav a {
  font-size: 28px;
}

/* Large Devices Styling */
.lg .nav ul.links {
  gap: 35px;
  font-size: 26px;
}

.lg .nav a {
  font-size: 30px;
}

/* Extra Large Devices Styling */
.xl .nav ul.links {
  gap: 40px;
  font-size: 28px;
}

.xl .nav a {
  font-size: 32px;
}

/* Extra Extra Large Devices Styling */
.xxl .nav ul.links {
  gap: 45px;
  font-size: 30px;
}

.xxl .nav a {
  font-size: 34px;
}
</style>
