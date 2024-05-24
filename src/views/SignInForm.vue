<template>
    <div class="frame" :class="{ 'signin-active': isSignIn }">
      <!-- Sign In Container -->
      <form class="form-auth" id="auth-section" @submit.prevent="handleEmailSignIn">
        <!-- Email Input Group for Sign In -->
        <fieldset class="form-group">
          <label for="signin-email" class="form-label">Email</label>
          <input id="signin-email" class="form-input" type="email" placeholder="Enter your email" v-model="email" />
          <div class="error-space">{{ computedEmailError }}</div>
        </fieldset>
  
        <!-- Password Input Group for Sign In -->
        <fieldset class="form-group">
          <label for="signin-password" class="form-label">Password</label>
          <input type="password" id="signin-password" class="form-input" placeholder="Enter password" v-model="password" />
          <div class="error-space">{{ computedPasswordError }}</div>
        </fieldset>
  
        <!-- Action Buttons for Sign In -->
        <div id="auth-buttons">
          <StyledButton label="Login" :onClick="handleEmailSignIn"></StyledButton>
          <div id="alt-login-divider"><span>OR</span></div>
          <StyledButton label="Continue with Katy ISD" :onClick="handleGoogleSignIn"></StyledButton>
        </div>
  
        <!-- Account Links for Sign In -->
        <nav id="account-links">
          <router-link to="/reset" class="link-style">Forgot Password?</router-link>
        </nav>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import StyledButton from '../components/StyledButton.vue';
  import { useAuth } from '../composables/useAuth';
  import { FirebaseError } from '@firebase/util';
  
  // Props
  const props = defineProps({
    isSignIn: Boolean
  });
  
  const email = ref('');
  const password = ref('');
  const { signInWithEmail, signInWithGoogle, authError, getErrorMessage, clearAuthError } = useAuth();
  const router = useRouter();
  
  // Watchers and Computed Properties
watchEffect(() => {
    if (email.value && authError.value?.code.includes('email')) {
      clearAuthError();
    }
    if (password.value && authError.value?.code.includes('password')) {
      clearAuthError();
    }
  });
  
  const computedEmailError = computed(() => {
    if (!authError.value) return '';
    return authError.value?.code.includes('email') || authError.value?.code.includes('user-not-found') ? getErrorMessage() : '';
  });
  
  const computedPasswordError = computed(() => {
    if (!authError.value) return '';
    return authError.value?.code.includes('password') ? getErrorMessage() : '';
  });
  
  // Methods
  const handleEmailSignIn = async () => {
    if (!email.value || !password.value) {
      if (!email.value) authError.value = { code: 'auth/invalid-email' } as FirebaseError;
      if (!password.value) authError.value = { code: 'auth/invalid-password' } as FirebaseError;
      return;
    }
  
    try {
      const userCredential = await signInWithEmail(email.value, password.value);
      if (userCredential) {
        await router.push('/scouting');
      }
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/too-many-requests') {
        authError.value = { code: 'auth/too-many-requests' } as FirebaseError;
      } else {
        authError.value = error as FirebaseError;
      }
    }
  };
  
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };
  </script>
  
  <style scoped>/* Global Styles */
*,
*:after,
*:before {
    box-sizing: border-box;
}

/* Frame Styles */
.frame {
    display: grid;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-font-smoothing: subpixel-antialiased;
    will-change: transform, opacity;
}

/* Authentication Section Styles */
#auth-section {
    position: absolute;
    width: 100%;
    padding-left: 1vh;
    will-change: transform, opacity;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Animation Keyframes */
@keyframes slideInFromLeft {
    from {
        transform: translateX(-100%) translateZ(0);
        opacity: 0;
    }
    to {
        transform: translateX(0) translateZ(0);
        opacity: 1;
    }
}

.frame.signin-active #auth-section {
    will-change: transform, opacity;
    -webkit-font-smoothing: antialiased;
    animation: slideInFromLeft 0.45s ease-in-out forwards;
}

/* Form Styling */
form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

/* Input Styling */
input {
    border-radius: 15px;
    padding: 1rem 2rem;
    font-weight: 400;
    background-color: transparent;
    border: 0.25vh solid #5b5b5b;
    width: 100%;
    height: 50px;
    color: var(--baseFg);
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
    font-weight: bold;
}

/* Form Group Styling */
.form-group {
    display: grid;
    grid-gap: 10px;
    flex-direction: column;
    font-family: 'Futura PT';
    z-index: 1;
    width: 100%;
    height: fit-content;
    margin-bottom: 20px;
}

/* Label Styling */
label {
    display: flex;
    color: var(--color);
    font-size: 1.25rem;
    z-index: 1;
    height: 20px;
    line-height: 20px;
    margin-bottom: 10px;
}

/* Authentication Buttons Styling */
#auth-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    align-items: center;
    justify-content: center;
}

/* Account Links Styling */
#account-links {
    display: grid;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 10%;
    gap: 5vh;
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

/* OR Separator Styling */
#alt-login-divider {
    position: relative;
    text-align: center;
    width: 100%;
    color: #8b8b94;
}

#alt-login-divider span {
    background-color: black;
    padding-left: 12px;
    padding-right: 12px;
    display: inline-block;
    line-height: 24px;
    position: relative;
    z-index: 1;
}

#alt-login-divider::before {
    content: "";
    height: 1px;
    width: 100%;
    position: absolute;
    left: 0;
    top: 12px;
    background-color: #6d6d6d;
}
  </style>