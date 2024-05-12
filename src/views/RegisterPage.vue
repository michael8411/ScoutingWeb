<template>
  <div id="base">
    <!-- Header Section -->
    <header id="top">
      <img id="circle_logo" src="../assets/images/cryptonite_logo.png" alt="Cryptonite Logo" />
    </header>

    <!-- Main Content Section -->
    <main id="middle">
      <!-- Register Box -->
      <section id="box">
        <h1 id="register_title">Register</h1>
        <div id="auth">
          <div id="inputs">
            <!-- Email Input Group -->
            <fieldset class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                class="form-input"
                type="email"
                placeholder="Enter your email"
                v-model="email"
              /> 
              <div class="error-space">{{ computedEmailError }}</div>
            </fieldset>

            <!-- Password Input Group -->
            <fieldset class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                class="form-input"
                placeholder="Create password"
                v-model="password"
              />
              <div class="error-space">{{ computedPasswordError }}</div>
              <!-- TODO: Add password toggle visibility -->
            </fieldset>
          </div>
          <!-- Action Buttons -->
          <div id="buttons">
            <Button label="Create Account" :onClick="handleCreateUser"></Button>
            <div id="or"><span>OR</span></div>
            <Button label="Continue with Katy ISD" :onClick="handleGoogleSignIn"></Button>
          </div>

          <!-- Account Links -->
          <nav id="account">
            <p id="login">
              <span>Already have an account? </span>
              <router-link to="/login" class="link-style">Login</router-link>
            </p>
          </nav>
        </div>
      </section>

      <!-- Graphic Section -->
      <aside id="graphic">
        <img id="glitch_logo" src="../assets/gifs/glitch.gif" alt="Glitch Logo" />
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import Button from '@/components/StyledButton.vue'
import { FirebaseError } from '@firebase/util'

const email = ref('')
const password = ref('')

const { signInWithEmail, signInWithGoogle, authError, getErrorMessage, clearAuthError } = useAuth()
const router = useRouter()

watch([email, password], () => {
  if (email.value && authError.value?.code.includes('email')) {
    clearAuthError()
  }
  if (password.value && authError.value?.code.includes('password')) {
    clearAuthError()
  }
})

const hasAuthError = (codePart: string) => authError.value?.code.includes(codePart)
const computedEmailError = computed(() => {
  if (!authError.value) return ''
  return hasAuthError('email') || hasAuthError('user-not-found') ? getErrorMessage() : ''
})

const computedPasswordError = computed(() => {
  if (!authError.value) return ''
  return hasAuthError('password') ? getErrorMessage() : ''
})

const handleCreateUser = async () => {
  // TODO: Add verification system w/ firebase to approve user before creation
  // if (!email.value || !password.value) {
  //     if (!email.value) authError.value = { code: 'auth/invalid-email' } as FirebaseError;
  //     if (!password.value) authError.value = { code: 'auth/invalid-password' } as FirebaseError;
  //     return;
  // }
  // const userCredential = await signInWithEmail(email.value, password.value);
  // if (userCredential) {
  //     await router.push('/login');
  // }
}

const handleGoogleSignIn = async () => {
  await signInWithGoogle()
}
</script>

<style scoped>
/* Reset and Box Sizing */
*,
*:after,
*:before {
  box-sizing: border-box;
}

/* Root Variables */
:root {
  --red: hsl(18, 100%, 50%);
  --green: rgb(56, 178, 77);
  --yellow: hsl(44, 83%, 53%);
  --blue: hsl(215, 100%, 53%);
  --grey: hsl(0, 0%, 45%);
  --text: var(--gray-5);
  --transition: 0.2s;
  --valid: var(--green);
  --invalid: var(--red);
  --focus: var(--indigo-3);
  --blur: var(--indigo-1);
  --disabled: var(--grey);
  --accent: #8b8b94;
  --boxBg: #19191a;
}

/* Color Scheme */
:where(html) {
  color-scheme: none;
}

/* Base Styling */
#base {
  display: flex;
  flex-direction: column;
  height: 90vh;
  min-height: fit-content;
  width: 95vw;
  margin: 5%;
  border-radius: 40px;
  background-color: #111111;
  position: relative;
  animation: box-rotate 4s linear infinite;
  border: 3px solid #202020;
}

/* Logo Styling */
#circle_logo {
  height: 100px;
  z-index: 2;
  margin-top: 5%;
  margin-left: 5%;
}

#top {
  display: flex;
  width: fit-content;
  height: fit-content;
}

#middle {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding-left: 3%;
  padding-right: 3%;
  gap: 10%;
  min-height: fit-content;
}

/* Box Styling */
#box {
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 600px;
  height: 700px;
  min-width: fit-content;
  border-radius: 30px;
  position: relative;
  animation: box-rotate 4s linear infinite;
  padding: 20px;
  border: 5px solid #151515;
}

/* Title Styling */
#register_title {
  font-family: 'Manrope', sans-serif;
  font-size: 55px;
  text-align: center;
  z-index: 1;
  line-height: 1;
}

/* Form Styling */
#auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 1;
  width: 350px;
  height: fit-content;
}

form {
  display: grid;
  gap: 30px;
  width: 100%;
}

/* Input Styling */
input {
  border-radius: 15px;
  padding: 1rem 2rem;
  font-weight: 400;
  background-color: transparent;
  border: 2px solid #8b8b94;
  color: var(--baseFg);
  width: 100%;
  height: 50px;
}

fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

input:focus-visible {
  outline-color: var(--color);
}

input::placeholder {
  color: var(--baseFg);
}

#inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

/* Form Group Styling */
.form-group {
  display: flex;
  flex-direction: column;
  font-family: 'Futura PT';
  z-index: 1;
  width: 100%;
}

.link-style {
  text-decoration: underline;
  color: #32cd32;
  cursor: pointer;
}

.link-style:hover {
  background-color: transparent;
  box-shadow: none;
}

label {
  display: flex;
  color: var(--color);
  font-size: 1.25rem;
  z-index: 1;
  height: 20px;
  line-height: 20px;
  margin-bottom: 10px;
}

/* Button Styling */
#buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

/* OR Seperator Styling */
#or {
  position: relative;
  text-align: center;
  width: 100%;
  color: #8b8b94;
}

#or span {
  background-color: black;
  padding-left: 12px;
  padding-right: 12px;
  display: inline-block;
  line-height: 24px;
  position: relative;
  z-index: 1;
}

#or::before {
  content: '';
  height: 1px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 12px;
  background-color: #8b8b94;
}

/* Account Styling */
#account {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;
}

#login {
  margin-block-start: 0;
  margin-block-end: 0;
}

/* Graphic Styling */
#graphic {
  display: flex;
  flex-direction: column;
  height: 70vh;
  background-color: black;
  justify-content: center;
  border-radius: 30px;
  border: 5px solid #202020;
}

#glitch_logo {
  width: 100%;
}

/* Error Message Styling */
.error-space {
  height: 10px;
  color: rgb(235, 53, 53);
}

/* Button Styling */
Button {
  width: 100%;
}

/* Animation Definitions */
@property --a {
  syntax: '<angle>';
  inherits: false;
  initial-value: 132deg;
}

@keyframes box-rotate {
  0% {
    --a: 0deg;
  }

  100% {
    --a: 360deg;
  }
}

/* Pseudo-elements for the box */
/* #box::before,
#box::after {
    content: '';
    position: absolute;
    border-radius: 30px;
}

#box::before {
    content: "";
    width: 101.5%;
    height: 101.5%;
    top: -0.6vh;
    border-radius: 30px;
    background-image: linear-gradient(var(--a),
            #32CD32,
            #3a3939,
            #0e0e0e 43%,
            #32CD32);
    position: absolute;
    z-index: -1;

    animation: box-rotate 2.5s linear infinite;
}

#box::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    height: calc(100% + 20px);
    width: calc(100% + 10px);
    background-image: linear-gradient(var(--a),
            #32CD32,
            #3a3939,
            #0e0e0e 43%,
            #32CD32);
    border-radius: 8px;
    filter: blur(15px);
    z-index: -1;
    opacity: 0.7;
    animation: box-rotate 2.5s linear infinite;
} */

#base::before,
#base::after {
  content: '';
  position: absolute;
  border-radius: 40px;
  /* Adjust to match #base's border-radius */
}

#base::before {
  width: 100.7%;
  height: 101.4%;
  top: -0.6vh;
  left: -0.6vh;
  background-image: linear-gradient(var(--a), #32cd32, #3a3939, #0e0e0e 43%, #32cd32);
  z-index: -1;
  animation: box-rotate 2.5s linear infinite;
}

#base::after {
  top: -10px;
  left: -10px;
  height: calc(100% + 20px);
  width: calc(100% + 20px);
  background-image: linear-gradient(var(--a), #32cd32, #3a3939, #0e0e0e 43%, #32cd32);
  filter: blur(15px);
  opacity: 0.7;
  z-index: -1;
  animation: box-rotate 2.5s linear infinite;
}

/* Screen Sizing */
@media only screen and ((max-height: 650px) or (max-width: 800px)) {
  #box {
    height: 100%;
    width: 100%;
    padding: 0px;
    border: none;
    border-radius: 0px;
  }

  #base {
    height: 100%;
    width: 100%;
    margin: 0px;
    border: none;
    border-radius: 0px;
    background-color: black;
  }

  #base::before {
    width: 0px;
    height: 0px;
    top: 0;
    left: 0;
    background-image: none;
    z-index: -1;
    animation: none;
  }

  #base::after {
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    background-image: none;
    filter: 0;
    opacity: 0;
    z-index: -1;
    animation: none;
  }

  #middle {
    padding: 0px;
  }

  #auth {
    max-width: 350px;
    width: 80%;
  }

  #account {
    gap: 0px;
  }

  #register_title {
    font-size: 48px;
    margin-block-start: 0em;
    margin-block-end: 0.5em;
  }

  #buttons {
    font-size: 0.9rem;
    gap: 10px;
  }

  #graphic {
    display: none;
  }
}

@media only screen and (max-height: 900px) {
  #box {
    height: 100%;
  }

  #graphic {
    height: 100%;
  }
}

@media only screen and (max-height: 880px) {
  #circle_logo {
    height: 70px;
  }

  #buttons {
    font-size: 0.9rem;
    gap: 10px;
  }

  Button {
    font-size: 0.9rem;
    margin-bottom: 3px;
  }

  #box {
    border: none;
  }

  #register_title {
    font-size: 38px;
    margin-block-start: 0em;
    margin-block-end: 0.5em;
  }

  label {
    font-size: 1.1rem;
    height: 20px;
    line-height: 20px;
    margin-bottom: 3px;
  }

  #inputs {
    gap: 12px;
  }

  #auth {
    gap: 12px;
  }

  #account {
    font-size: 0.9rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    font-family: 'Futura PT';
    z-index: 1;
    width: 100%;
  }
}
</style>
