<!-- AuthPage.vue -->
<template>
  <div :class="current">
    <div class="background"></div>
    <div class="base">
      <div class="gradient"></div>
      <div class="container">
        <div class="login-frame">
          <div class="login-content">
            <AuthNav :isSignIn="isSignIn" @toggleForm="toggleForm" />
            <transition :name="transitionName" mode="out-in">
              <div class="frame" :key="isSignIn ? 'signin' : 'signup'">
                <AuthenticationForm v-if="isSignIn" @forgotPassword="openPasswordResetOverlay" />
                <RegistrationForm v-else />
              </div>
            </transition>
          </div>
        </div>
      </div>
      <GraphicSection />
    </div>
    <PasswordResetOverlay ref="passwordResetOverlay" @close="closePasswordResetOverlay" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useBreakpoints } from '../composables/useBreakpoints'
import AuthNav from '../components/Auth/AuthNav.vue'
import RegistrationForm from '../components/Auth/RegistrationForm.vue'
import AuthenticationForm from '../components/Auth/AuthenticationForm.vue'
import GraphicSection from '../components/Auth/GraphicSection.vue'
import PasswordResetOverlay from '../components/Auth/PasswordResetOverlay.vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { FirebaseError } from '@firebase/util'

const isSignIn = ref(true)

const { current } = useBreakpoints()
const { authError, clearAuthError } = useAuth()
const router = useRouter()

const toggleForm = (signInState: boolean) => {
  isSignIn.value = signInState
}

const transitionName = computed(() => {
  return isSignIn.value ? 'slide-left' : 'slide-right'
})

watch(isSignIn, () => {
  clearAuthError()
})

watch(authError, async (error) => {
  if (error && (error as FirebaseError).code === 'auth/user-not-found') {
    isSignIn.value = false
    await router.push('/register')
  }
})
const passwordResetOverlay = ref<InstanceType<typeof PasswordResetOverlay> | null>(null)

const openPasswordResetOverlay = () => {
  passwordResetOverlay.value?.openOverlay()
}

const closePasswordResetOverlay = () => {
  passwordResetOverlay.value?.closeOverlay()
}
</script>

<style scoped>
@font-face {
  font-family: 'Poppins-Thin';
  src: url('@/assets/fonts/Poppins/Poppins/Poppins-Thin.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

*,
*:after,
*:before {
  box-sizing: border-box;
  font-family: 'Poppins-Thin', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.glassmorphic-background {
  transition: backdrop-filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Base styles */
.base {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 90vh;
  min-height: fit-content;
  max-width: 1700px;
  width: 90vw;
  margin: auto;
  border-radius: 10rem;
  background-color: #050505;
  position: relative;
  --x: 50%;
  --y: 50%;
  background: linear-gradient(#3b3b3b, #070707) padding-box,
    radial-gradient(farthest-corner at var(--x) var(--y), #848484, #020202) border-box;
  background: rgba(0, 0, 0, 0.1);
}

.base::before,
.base::after {
  content: '';
  position: absolute;
  border-radius: 42px;
  background-image: linear-gradient(var(--a), #000000, #3a3939, #0e0e0e 43%, #001600);
  animation: rotate-gradient 30s linear infinite;
}

.base::before {
  top: 0.35vh;
  left: 0.35vh;
  right: 0.35vh;
  bottom: 0.35vh;
  background-image: linear-gradient(var(--a), #000000, #3a3939, #0e0e0e 43%, #465046);
  z-index: -2;
}

.base::after {
  top: 17px;
  left: 10px;
  right: 10px;
  height: calc(100%);
  width: calc(100%);
  background-image: linear-gradient(var(--a), #000000, #3a3939, #0e0e0e 43%, #1f1f1f);
  filter: blur(10px);
  opacity: 0.7;
  z-index: -1;
}

/* Responsive styles for base */
.xs .base,
.sm .base {
  height: 100vh;
  width: 100vw;
  margin: 0;
  background-color: black;
  border-radius: 0;
}

.xs .base::before,
.xs .base::after,
.sm .base::before,
.sm .base::after {
  display: none;
}

/* Gradient styles */
.gradient {
  --rotate-angle: 360deg;
  position: absolute;
  top: 20px;
  left: 15px;
  height: calc(100% - 20px);
  width: calc(100% - 10px);
  background-image: linear-gradient(var(--rotate-angle), #050f05, #202020, #0e0e0e 43%, #b6b6b6);
  animation: rotate-gradient 20s linear infinite;
  filter: blur(0.5rem);
  border-radius: 25px;
  opacity: 0.5;
  z-index: -1;
}

/* Container styles */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
}

/* Responsive styles for container */
.md .container {
  width: 100%;
}

.lg .container {
  width: 50%;
  height: 100%;
}

/* Login frame styles */
.login-frame {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-width: 100%;
  margin: 0;
  padding: 1.25rem;
  box-sizing: border-box;
  border-radius: var(--login-frame-border-radius);
  transform-origin: top left;
  position: relative;
  transition: background-position 0.3s, border-color 0.3s;
  z-index: 1;
  object-fit: contain;
  background-color: rgba(0, 0, 0, 0.445);
}

.login-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 1;
  filter: blur(0.3125rem) brightness(50%);
  z-index: 0;
}

.login-frame,
.graphic {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(0.625rem);
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0.5rem 2rem 0 rgba(0, 0, 0, 0.37);
}

/* Responsive styles for login frame */
.xs .login-frame,
.sm .login-frame {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  border-radius: 0.9375rem;
  background: none;
}

.lg .login-frame,
.xl .login-frame {
  width: 100%;
  border-radius: 0;
  justify-content: center;
  align-items: center;
}

.xxl .login-frame {
  width: 100%;
}

/* Login content styles */
.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0.5;
}

/* Responsive styles for login content */
.xs .login-content,
.sm .login-content,
.md .login-content,
.lg .login-content,
.xl .login-content,
.xxl .login-content {
  display: block;
  width: 100%;
  max-width: 40.625rem;
  min-height: 40.625rem;
}

.xxl .login-content {
  max-width: 40.625rem;
  min-height: 40.625rem;
}

/* Frame styles */
.frame {
  display: flex;
  justify-content: center;
  border-radius: 10%;
  width: 100%;
  height: 100%;
  min-height: 25rem;
  -webkit-font-smoothing: subpixel-antialiased;
  will-change: transform, opacity;
}

/* Animation styles */
@property --a {
  syntax: '<angle>';
  inherits: false;
  initial-value: 132deg;
}

@keyframes rotate-gradient {
  0% {
    --a: 0deg;
  }
  100% {
    --a: 360deg;
  }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.15s cubic-bezier(0, 1.06, 0.99, 0), opacity 0.75s;
}

.slide-left-enter,
.slide-right-enter {
  opacity: 0;
  transform: scale(0.8);
}

.slide-left-enter-active {
  animation: slideInFromRight 0.75s forwards;
}

.slide-right-enter-active {
  animation: slideInFromLeft 0.75s forwards;
}

.slide-left-leave-active {
  animation: slideOutToLeft 0.75s forwards;
}

.slide-right-leave-active {
  animation: slideOutToRight 0.75s forwards;
}

/* Keyframe animations */
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%) scale(0.8);
    opacity: 0;
  }
  40% {
    transform: translateX(5%) scale(1.02);
    opacity: 1;
  }
  60% {
    transform: translateX(-5%) scale(0.98);
    opacity: 1;
  }
  80% {
    transform: translateX(1%) scale(1.01);
    opacity: 1;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  40% {
    transform: translateX(-5%) scale(1.02);
    opacity: 1;
  }
  60% {
    transform: translateX(2%) scale(0.98);
    opacity: 1;
  }
  80% {
    transform: translateX(-1%) scale(1.01);
    opacity: 1;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideOutToLeft {
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%) scale(0.8);
    opacity: 0;
  }
}

@keyframes slideOutToRight {
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
}

/* Auth and register section styles */
#auth-section,
#register-section {
  position: absolute;
  width: 100%;
  height: fit-content;
  will-change: transform, opacity;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
