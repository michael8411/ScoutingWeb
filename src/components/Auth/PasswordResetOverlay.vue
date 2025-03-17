<!--PasswordResetpage-->
<template>
  <div class="password-reset-container" :class="{ 'is-active': show }">
    <transition name="overlay-fade">
      <div v-if="show" class="password-reset-overlay" @click.self="closeOverlay">
        <div class="glassmorphic-background"></div>
      </div>
    </transition>

    <transition name="card-slide">
      <div v-if="show" class="password-reset-card">
        <div class="card-content">
          <div class="heading">
            <img class="icon" src="../../assets/images/LockGlow.png" alt="Lock Icon" />
            <h1 class="title">Forgot Password</h1>
            <p class="subtitle">Enter your email address for a link to reset your password.</p>
          </div>
          <div class="main">
            <div class="form-group">
              <InputField
                id="signin-email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                v-model="email"
                :error-message="computedEmailError"
              />
            </div>
            <StyledButton
              class="send-button"
              :label="buttonLabel"
              @click="handlePasswordReset"
              :loading="isLoading"
              loadingText="Sending Email"
            />
            <a href="#" class="link-style" @click.prevent="closeOverlay">Back to Login</a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import StyledButton from '@/components/StyledButton.vue'
import InputField from '@/components/Auth/InputField.vue'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'

const email = ref('')
const { authError, getErrorMessage, clearAuthError } = useAuth()
const isLoading = ref(false)
const buttonLabel = ref('Send')

const computedEmailError = computed(() => {
  if (!authError.value) return ''
  return authError.value.code.includes('email') || authError.value.code.includes('user-not-found')
    ? getErrorMessage()
    : ''
})

const handlePasswordReset = async () => {
  if (!email.value) {
    authError.value = { code: 'auth/invalid-email' } as FirebaseError
    return
  }
  isLoading.value = true
  const auth = getAuth()
  try {
    await sendPasswordResetEmail(auth, email.value)
    isLoading.value = false
    buttonLabel.value = 'Email Sent!'
  } catch (error) {
    isLoading.value = false
    authError.value = error as FirebaseError
  }
}

const show = ref(false)
const emit = defineEmits(['close'])

const openOverlay = () => {
  show.value = true
}

const closeOverlay = () => {
  show.value = false
  emit('close')
}

defineExpose({
  openOverlay,
  closeOverlay
})
</script>
<style scoped>
/* Overlay fade transition */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.6s ease;
}

.overlay-fade-enter,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Card slide transition */
.card-slide-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.card-slide-enter-from {
  opacity: 0;
  transform: translateY(50px);
}
.card-slide-leave-active {
  transition: transform 0.6s ease, opacity 0.6s ease;
}

.card-slide-enter,
.card-slide-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(50px);
  }
}

/* Styles for the password reset overlay */
.password-reset-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: none;
}

.password-reset-container.is-active {
  pointer-events: auto;
}

/* Styles for the glassmorphic background */
.glassmorphic-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  transition: backdrop-filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

/* Styles for the password reset card */
.password-reset-card {
  max-width: 450px;
  width: 90%;
  padding: 40px;
  background: rgba(15, 15, 15, 0.1);
  backdrop-filter: blur(100px);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(61, 61, 61, 0.1);
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Styles for the card content */
.card-content {
  text-align: center;
}

/* Styles for the heading */
.heading {
  margin-bottom: 30px;
}

/* Styles for the lock icon */
.icon {
  width: 160px;
  height: 160px;
  margin-bottom: -20px;
  filter: drop-shadow(0 0 15px rgba(38, 255, 0, 0.5));
}

/* Styles for the title */
.title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #d9d9d9;
  margin-bottom: 10px;
}

/* Styles for the subtitle */
.subtitle {
  font-size: 1.25rem;
  color: #d9d9d9;
  margin-bottom: 30px;
}

/* Styles for the main content */
.main {
  text-align: left;
}

/* Styles for the form group */
.form-group {
  margin-bottom: 20px;
}

/* Styles for the send button */
.send-button {
  font-size: 1.125rem;
  background-color: rgb(12, 12, 12);
}

/* Styles for the link */
.link-style {
  display: block;
  margin-top: 20px;
  color: #d9d9d9;
  font-size: 1.3rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-style:hover {
  color: #39ff14;
  background-color: transparent;
}

/* Responsive styles */
@media screen and (max-width: 480px) {
  .password-reset-card {
    width: 100%;
    height: 100%;
    border-radius: 0px;
    padding: 20px;
    margin: 0 auto;
    box-shadow: none;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.125rem;
  }

  .send-button {
    font-size: 1rem;
  }

  .link-style {
    font-size: 0.875rem;
  }
}
</style>
