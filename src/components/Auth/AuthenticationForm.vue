<!-- AuthentenicationComponent.vue -->
<template>
  <form class="form-auth" id="auth-section" @submit.prevent="handleSubmit">
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
    <div class="form-group">
      <InputField
        id="signin-password"
        label="Password"
        type="password"
        placeholder="Enter password"
        v-model="password"
        :error-message="computedPasswordError"
        :hideText="true"
      />
    </div>
    <div class="auth-actions">
      <div class="remember-forgot">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="rememberMe" v-model="rememberMe" />
          <label class="form-check-label" for="rememberMe">Remember Me</label>
        </div>
        <a href="#" class="link-style" @click.prevent="forgotPassword">Forgot Password?</a>
      </div>
    </div>
    <div class="auth-buttons">
      <StyledButton class="submit-button" label="Login" :onClick="handleSubmit"></StyledButton>
    </div>
    <div class="alt-auth">
      <div class="alt-auth-divider"><span>Or Sign In With</span></div>
      <div class="alt-auth-buttons">
        <StyledButton
          class="katy-button"
          :onClick="handleGoogleSignIn"
          :icon="katyLogo"
        ></StyledButton>
        <StyledButton
          class="google-button"
          :onClick="handleGoogleSignIn"
          :icon="googleLogo"
        ></StyledButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useRouter } from 'vue-router'
import StyledButton from '../StyledButton.vue'
import InputField from './InputField.vue'
import { FirebaseError } from '@firebase/util'
import katyLogo from '@/assets/images/katy-isd-logo.png'
import googleLogo from '@/assets/images/google-logo.png'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const {
  signInWithEmail,
  signInWithGoogle,
  signInWithKatyISD,
  authError,
  getErrorMessage,
  clearAuthError
} = useAuth()
const router = useRouter()

const computedEmailError = computed(() => {
  if (!authError.value) return ''
  return authError.value.code.includes('email') || authError.value.code.includes('user-not-found')
    ? getErrorMessage()
    : ''
})

const computedPasswordError = computed(() => {
  if (!authError.value) return ''
  return authError.value.code.includes('password') ? getErrorMessage() : ''
})

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    if (!email.value) authError.value = { code: 'auth/invalid-email' } as FirebaseError
    if (!password.value) authError.value = { code: 'auth/invalid-password' } as FirebaseError
    return
  }

  try {
    const userCredential = await signInWithEmail(email.value, password.value, rememberMe.value)
    if (userCredential) {
      await router.push('/scouting')
    }
  } catch (error) {
    if ((error as FirebaseError).code === 'auth/too-many-requests') {
      authError.value = { code: 'auth/too-many-requests' } as FirebaseError
    } else {
      authError.value = error as FirebaseError
    }
  }
}

const handleGoogleSignIn = async () => {
  await signInWithGoogle()
}

const handleKatyISDSignIn = async () => {
  await signInWithKatyISD()
}
const emit = defineEmits(['forgotPassword'])

const forgotPassword = () => {
  emit('forgotPassword')
}
</script>

<style scoped>
/* Font Styles */
@font-face {
  font-family: 'Poppins-Thin';
  src: url('@/assets/fonts/Poppins/Poppins-Thin.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Global Styles */
*,
*:after,
*:before {
  box-sizing: border-box;
  font-family: 'Poppins-Thin', sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Form Styles */
.form-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Form Group Styles */
.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
}

/* Authentication Actions Styles */
.auth-actions {
  width: 100%;
  margin-bottom: 1.5rem;
}

/* Remember Me and Forgot Password Styles */
.remember-forgot {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-family: '', sans-serif;
}

/* Form Check Styles */
.form-check {
  display: flex;
  align-items: center;
}

.form-check-input {
  appearance: none;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid #fff;
  border-radius: 0.15em;
  display: inline-block;
  position: relative;
  margin-right: 0.5rem;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: transparent;
}

.form-check-input:checked::before {
  content: '\2713';
  font-size: 0.9em;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form-check-label {
  color: #fff;
  font-family: 'Poppins-Medium', sans-serif;
  font-size: 1rem;
}

/* Link Styles */
.link-style {
  color: #32cd32;
  text-decoration: none;
  font-family: 'Poppins-Medium', sans-serif;
  background-color: transparent;
  font-size: 1rem;
}

.link-style:hover {
  text-decoration: underline;
}

/* Authentication Buttons Styles */
.auth-buttons {
  width: 100%;
}

.google-button * {
  height: 45px;
  padding-top: 5px;
}

/* Alternative Authentication Styles */
.alt-auth {
  width: 100%;
}

/* Alternative Auth Divider Styles */
.alt-auth-divider {
  position: relative;
  text-align: center;
  margin-bottom: 0.75rem;
  margin-top: 0.75rem;
  color: #8b8b94;
  display: flex;
  align-items: center;
}
/* Button Styles */
.submit-button {
  color: #8484a1;
}

.alt-auth-divider span {
  background-color: transparent;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
  font-size: 23px;
  font-family: 'Poppins-Thin', sans-serif;
  font-weight: bold;
}

.alt-auth-divider::before,
.alt-auth-divider::after {
  content: '';
  flex-grow: 1;
  height: 1px;
  background-color: #6d6d6d;
}

.alt-auth-divider::before {
  margin-right: 1rem;
}

.alt-auth-divider::after {
  margin-left: 1rem;
}
/* Alternative Authentication Buttons Styles */
.alt-auth-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
}

/* Alternative Login Divider Styles */
#alt-login-divider {
  position: relative;
  text-align: center;
  width: 99%;
  color: #8b8b94;
}

#alt-login-divider span {
  background-color: transparent;
  line-height: 24px;
  position: relative;
  z-index: 1;
}

#alt-login-divider::before {
  content: '';
  height: 1px;
  width: 100%;
  position: absolute;
  left: 0;
  background-color: #6d6d6d;
}

/* Responsive Styles */

/* Extra Small Devices Styling */
.xs .form-auth {
  width: 100%;
}

.xs .form-group {
  margin-bottom: 15px;
}

.xs .form-label {
  font-size: 16px;
}

.xs .form-input {
  font-size: 18px;
  padding: 10px 14px;
}

.xs .remember-forgot {
  align-items: flex-start;
  gap: 0.5rem;
}

.xs .form-check-label {
  font-size: 14px;
}

.xs .link-style {
  font-size: 14px;
}

.xs #alt-auth-buttons {
  gap: 0.5rem;
}

.xs .button-container {
  flex-direction: column;
  gap: 0.5rem;
}

/* Small Devices Styling */
.sm .form-auth {
  width: 100%;
}

.sm .form-group {
  margin-bottom: 15px;
}

.sm .form-label {
  font-size: 16px;
}

.sm .form-input {
  font-size: 18px;
  padding: 10px 14px;
}

.sm .remember-forgot {
  align-items: flex-start;
  gap: 0.5rem;
}

.sm .form-check-label {
  font-size: 14px;
}

.sm .link-style {
  font-size: 14px;
}

.sm #alt-auth-buttons {
  gap: 0.5rem;
}

.sm .button-container {
  flex-direction: column;
  gap: 0.5rem;
}
/* Medium Devices Styling */
.md .form-auth {
  width: 80%;
}

.md .form-group {
  margin-bottom: 20px;
}

.md .form-label {
  font-size: 18px;
}

.md .form-input {
  font-size: 20px;
  padding: 12px 16px;
}

.md .remember-forgot {
  align-items: center;
  gap: 1rem;
}

.md .form-check-label {
  font-size: 16px;
}

.md .link-style {
  font-size: 16px;
}

.md #alt-auth-buttons {
  gap: 1rem;
}

.md .button-container {
  flex-direction: row;
  gap: 1rem;
}

/* Large Devices Styling */
.lg .form-auth {
  width: 60%;
}

.lg .form-group {
  margin-bottom: 25px;
}

.lg .form-label {
  font-size: 20px;
}

.lg .form-input {
  font-size: 22px;
  padding: 14px 18px;
}

.lg .remember-forgot {
  align-items: center;
  gap: 1.5rem;
}

.lg .form-check-label {
  font-size: 18px;
}

.lg .link-style {
  font-size: 18px;
}

.lg #alt-auth-buttons {
  gap: 1.5rem;
}

.lg .button-container {
  flex-direction: row;
  gap: 1.5rem;
}

/* Extra Large Devices Styling */
.xl .form-auth {
  width: 50%;
}

.xl .form-group {
  margin-bottom: 30px;
}

.xl .form-label {
  font-size: 22px;
}

.xl .form-input {
  font-size: 24px;
  padding: 16px 20px;
}

.xl .remember-forgot {
  align-items: center;
  gap: 2rem;
}

.xl .form-check-label {
  font-size: 20px;
}

.xl .link-style {
  font-size: 20px;
}

.xl #alt-auth-buttons {
  gap: 2rem;
}

.xl .button-container {
  flex-direction: row;
  gap: 2rem;
}

/* Extra Extra Large Devices Styling */
.xxl .form-auth {
  width: 40%;
}

.xxl .form-group {
  margin-bottom: 35px;
}

.xxl .form-label {
  font-size: 24px;
}

.xxl .form-input {
  font-size: 26px;
  padding: 18px 22px;
}

.xxl .remember-forgot {
  align-items: center;
  gap: 2.5rem;
}

.xxl .form-check-label {
  font-size: 22px;
}

.xxl .link-style {
  font-size: 22px;
}

.xxl #alt-auth-buttons {
  gap: 2.5rem;
}

.xxl .button-container {
  flex-direction: row;
  gap: 2.5rem;
}
</style>
