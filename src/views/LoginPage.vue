
<template>

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <div :class="breakpoint">

        <div id="background"></div>
        <div id="base">
            <div id="gradient"></div>

            <!-- Main Content Section -->
            <div class="container">
                <div id="login-frame">
                    <div class="login-content">
                        <div class="nav">
                            <ul class="links">
                                <li :class="{ 'signin-active': isSignIn }" @click="toggleForm(true)">
                                    <a class="signin-btn">Sign in</a>
                                </li>
                                <li :class="{ 'signup-active': !isSignIn }" @click="toggleForm(false)">
                                    <a class="signup-btn">Sign up</a>
                                </li>
                            </ul>
                        </div>

                        <!-- Combined Authentication Container -->
                        <div class="frame" :class="{ 'signin-active': isSignIn, 'signup-active': !isSignIn }">
                            <!-- Sign In Container -->
                            <form class="form-auth" id="auth-section" @submit.prevent="handleEmailSignIn">
                                <!-- Email Input Group for Sign In -->
                                <fieldset class="form-group">
                                    <label for="signin-email" class="form-label">Email</label>
                                    <input id="signin-email" class="form-input" type="email"
                                        placeholder="Enter your email" v-model="email" />
                                    <div class="error-space">{{ computedEmailError }}</div>
                                </fieldset>

                                <!-- Password Input Group for Sign In -->
                                <fieldset class="form-group">
                                    <label for="signin-password" class="form-label">Password</label>
                                    <input type="password" id="signin-password" class="form-input"
                                        placeholder="Enter password" v-model="password" />
                                    <div class="error-space">{{ computedPasswordError }}</div>
                                </fieldset>

                                <!-- Action Buttons for Sign In -->
                                <div id="auth-buttons">
                                    <StyledButton label="Login" :onClick="handleEmailSignIn"></StyledButton>
                                    <div id="alt-login-divider"><span></span></div>
                                    <StyledButton label="Continue with Katy ISD" :onClick="handleGoogleSignIn">
                                    </StyledButton>
                                </div>

                                <!-- Account Links for Sign In -->
                                <nav id="account-links">

                                    <router-link to="/reset" class="link-style">Forgot Password?</router-link>
                                </nav>
                            </form>

                            <!-- Register Container -->
                            <form class="form-auth" id="register-section" @submit.prevent="handleEmailSignIn">
                                <fieldset class="form-group">
                                    <label for="signup-email" class="form-label">Email</label>
                                    <input id="signup-email" class="form-input" type="email"
                                        placeholder="Enter your email" v-model="email" />
                                    <div class="error-space">{{ computedEmailError }}</div>
                                </fieldset>

                                <!-- Password Input Group for Sign Up -->
                                <fieldset class="form-group">
                                    <label for="signup-password" class="form-label">Password</label>
                                    <input type="password" id="signup-password" class="form-input"
                                        placeholder="Enter password" v-model="password" />
                                    <div class="error-space">{{ computedPasswordError }}</div>
                                </fieldset>

                                <!-- Action Buttons for Sign Up -->
                                <div id="auth-buttons">
                                    <div id="alt-login-divider"><span></span></div>
                                    <StyledButton label="Register" :onClick="handleEmailSignIn"></StyledButton>

                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Graphic Section -->
            <aside id="graphic">
                <img id="glitch_logo" src="../assets/images/624Glow.png" alt="Glitch Logo">
            </aside>

        </div>
    </div>
</template>



<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';
import StyledButton from '../components/StyledButton.vue';
import { FirebaseError } from '@firebase/util';
import { useBreakpoints } from '../composables/useBreakpoints';


// Define reactive state
const isSignIn = ref(true);

const email = ref('');
const password = ref('');
const { signInWithEmail, signInWithGoogle, authError, getErrorMessage, clearAuthError } = useAuth();
const router = useRouter();

// Breakpoints composable - responsive design constants

const { breakpoint } = useBreakpoints();

// Auth Error Handling
watch([email, password], () => {
    if (email.value && authError.value?.code.includes('email')) {
        clearAuthError();
    }
    if (password.value && authError.value?.code.includes('password')) {
        clearAuthError();
    }
});

const hasAuthError = (codePart: string) => authError.value?.code.includes(codePart);

const computedEmailError = computed(() => {
    if (!authError.value) return '';
    return hasAuthError('email') || hasAuthError('user-not-found') ? getErrorMessage() : '';
});

const computedPasswordError = computed(() => {
    if (!authError.value) return '';
    return hasAuthError('password') ? getErrorMessage() : '';
});

// Methods
const toggleForm = (signInState: boolean) => {
    isSignIn.value = signInState;
};

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
            // Handle the error here
            authError.value = { code: 'auth/too-many-requests' } as FirebaseError;

        } else {
            // Other errors
            authError.value = error as FirebaseError;
        }
    }
};

const handleGoogleSignIn = async () => {
    await signInWithGoogle();
};

</script>

  


<style scoped>
/* Global Styles */
*,
*:after,
*:before {
    box-sizing: border-box;
}

/* Frame Styles */
.frame {
    display: flex;
    justify-content: center;
    width: 100%;
    height: fit-content;
    -webkit-font-smoothing: subpixel-antialiased;
    will-change: transform, opacity;
}

/* Container Styles */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; 
    width: 50%; 
}

/* Authentication Section Styles */
#auth-section,
#register-section {
    position: absolute;
    width: 100%;
    height: fit-content;
    will-change: transform, opacity;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Animation Keyframes */
@keyframes slideInFromRight {
    from {
        transform: translateX(100%) translateZ(0);
        opacity: 0;
    }
    to {
        transform: translateX(0) translateZ(0);
        opacity: 1;
    }
}

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

@keyframes slideOutToLeft {
    from {
        transform: translateX(0) translateZ(0);
        opacity: 1;
    }
    to {
        transform: translateX(-100%) translateZ(0);
        opacity: 0;
    }
}

@keyframes slideOutToRight {
    from {
        transform: translateX(0) translateZ(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%) translateZ(0);
        opacity: 0;
    }
}

/* State Specific Frame Styles */
.frame.signin-active,
.frame.signup-active {
    height: 500px;
}

.frame.signin-active #auth-section,
.frame.signup-active #register-section,
.frame.signin-active #register-section,
.frame.signup-active #auth-section {
    will-change: transform, opacity;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
}

/* Active State Transitions */
.frame.signin-active #auth-section {
    animation: slideInFromLeft 0.45s ease-in-out forwards;
}

.frame.signup-active #register-section {
    animation: slideInFromRight 0.45s ease-in-out forwards;
}

.frame.signin-active #register-section {
    animation: slideOutToRight 0.45s ease-in-out forwards;
}

.frame.signup-active #auth-section {
    animation: slideOutToLeft 0.45s ease-in-out forwards;
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
    font-family: 'Manrope', sans-serif;
    font-size: 22px;
    justify-content: flex-start;
}

.nav a {
    text-decoration: none;
    color: #6c6c6c;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: transparent;
    opacity: 0.5;
}

.nav a::after {
    content: '';
    display: flex;
    margin: auto;
    height: 3px;
    width: 0px;
    background: transparent;
    transition: width .5s ease, background-color .5s ease;
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

/* Logo and Header Styling */
/* Placeholder for Logo Styles */
/* Placeholder for Header Styles */

/* Main Content Styling */
#main-content {
    position: relative;
    display: flex;
    overflow: hidden;
    flex-direction: row;
    width: 100%;
    height: 100%;
    justify-content: center;
    padding-left: 3%;
    padding-right: 3%;
    gap: 0%;
    min-height: fit-content;
    align-items: center;
}

/* Login Section Styling */
#login-frame {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    max-width: 100%;
    margin: 0;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 40px 0px 0px 40px;
    transform-origin: top left;
    position: relative;
    overflow: hidden;
    border: 3px solid transparent;
    border-right: 4px transparent;
    transition: background-position 0.3s, border-color 0.3s;
    z-index: 1;
    object-fit: cover;
    background-color: rgba(0, 0, 0, 0.9);
}

#login-frame::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.7;

    filter: blur(5px) brightness(50%);
    z-index: 0;
}

/* Login Title Styling */
#login-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    z-index: 1;
    width: 350px;
    height: fit-content;
    font-family: 'Manrope', sans-serif;
    font-size: 25px;
    padding-bottom: 5vh;
    line-height: 1;
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
    grid-template-columns: 1fr;
    font-family: 'Futura PT';
    z-index: 1;
    width: 100%;
    height: fit-content;
    margin-bottom: 20px;
}

.form-group input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #b7b7b7 inset !important;
    box-shadow: 0 0 0 30px #b7b7b7 inset !important;
}

/* Link Style */
.link-style {
    text-decoration: underline;
    color: #32CD32;
    cursor: pointer;
}

.link-style:hover {
    background-color: transparent;
    box-shadow: none;
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
    grid-template-columns: 1fr;
    align-items: center;
    justify-content: center;
    padding-top: 10%;
    gap: 5vh;
}

/* OR Separator Styling */
#alt-login-divider {
    position: relative;
    text-align: center;
    width: 99%;
    color: #8b8b94;
}

#alt-login-divider span {
    background-color: transparent;
    padding-left: 12px;
    padding-right: 12px;
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

/* Signup Styling */
#signup {
    margin-block-start: 0;
    margin-block-end: 0;
}

/* Graphic Styling */
#graphic {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 50%;
    background-color: rgba(0, 0, 0, 0.45);
    justify-content: center;
    align-items: center;
    border-radius: 40px;
    --x: 50%;
    --y: 50%;
    border: 3px solid transparent;
    border-radius: 0px 30px 30px 0px;
    z-index: 1;
}

#graphic::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.7;
    background: url("src/assets/images/BlurredBackground.png") rgb(0, 0, 0) 90% / cover no-repeat;
    filter: blur(5px) brightness(50%);
    z-index: 0;
    animation: breathingBlur 3.5s ease-in-out  infinite;
}

@keyframes breathingBlur {
    0%, 100% {
        filter: blur(10px) brightness(50%);
    }
    50% {
        filter: blur(70px) brightness(50%);
    }
}

#glitch_logo {
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

/* Error Message Styling */
.error-space {
    height: 10px;
    color: rgb(235, 53, 53);
}

/* Button Styling */
Button {
    width: 100%;
}

/* Base Styling */
/* ... */

/* Background Styling */
#background {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background-size: cover;
    background-position: center;
    background-color: #1c1c1c16;
}

/* Property Styling */
@property --a {
    syntax: '<angle>';
    inherits: false;
    initial-value: 132deg;
}

/* Gradient Animation */
@keyframes rotate-gradient {
    0% {
        --a: 0deg;
    }
    100% {
        --a: 360deg;
    }
}

/* Base Container Styling */
#base {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    height: 90vh;
    min-height: fit-content;
    max-width: 1700px;
    width: 90vw;
    margin: auto;
    border-radius: 40px;
    background-color: #050505;
    position: relative;
    --x: 50%;
    --y: 50%;

    background: linear-gradient(#0b0b0b, #070707) padding-box,
        radial-gradient(farthest-corner at var(--x) var(--y), #848484, #020202) border-box;
}

#base::before, #base::after {
    content: '';
    position: absolute;
    border-radius: 42px;
    /* Other styles... */
    background-image: linear-gradient(var(--a), #000000, #3a3939, #0e0e0e 43%, #0c300c);
    animation: rotate-gradient 30s linear infinite;
}

#base::before {
    top: 0.35vh;
    left: 0.35vh;
    right: 0.35vh;
    bottom: 0.35vh;
    background-image: linear-gradient(var(--a), #000000, #3a3939, #0e0e0e 43%, #0c300c);
    z-index: -2;
    animation: rotate-gradient 30s linear infinite;
}

#base::after {
    top: 17px;
    left: 10px;
    right: 10px;
    height: calc(100%);
    width: calc(100%);
    background-image: linear-gradient(var(--a), #000000, #3a3939, #0e0e0e 43%, #0c300c);
    filter: blur(10px);
    opacity: 0.7;
    z-index: -1;
    animation: rotate-gradient 30s linear infinite;
}

#gradient {
    --rotate-angle: 360deg;
    position: absolute;
    top: 20px;
    left: 15px;
    height: calc(100% - 20px);
    width: calc(100% - 10px);
    background-image: linear-gradient(var(--rotate-angle), #0e460e, #3a3939, #0e0e0e 43%, #0c300c);
    animation: rotate-gradient 20s linear infinite;
    filter: blur(0.5rem);
    border-radius: 25px;
    opacity: 0.5;
    z-index: -1;
    animation: rotate-gradient 20s linear infinite;
}



/* Extra Small Devices Styling */
.xs .login-content {
    position: relative;
    width: 100%;
    height: fit-content;
    overflow-y: auto;
    overflow-x: hidden; /* Prevent horizontal scrollbar */
}

.xs #login-frame {
    position: fixed;
    height: 100%;
    width: 100%;
    border-radius: 10px;
}

.xs #base {
    height: 100vh;
    width: 100vw;
    margin: 0;
    background-color: black;
    border-radius: 0;
}

.xs #base::before, 
.xs #base::after {
    display: none;
}

.xs #main-content {
    flex-direction: column;
    padding: 0;
}

.xs #login-title {
    font-size: 36px;
    margin-block: 0;
}

.xs #graphic {
    display: none;
}

/* Small Devices Styling */
.sm .login-content {
    display: block;
    width: 100%;
    height: fit-content;
}

.sm #login-frame {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    border-radius: 15px;
    background: none;
}

.sm #base {
    
    height: 100vh;
    width: 100vw;
    margin: 0;
    background-color: black;
    border-radius: 0;
}

.sm #base::before, 
.sm #base::after {
    display: none;
}

.sm #main-content {
    flex-direction: column;
    padding: 0;
}

.sm #login-title {
    font-size: 42px;
    margin-block: 0;
}

.sm #graphic {
    display: none;
}

/* Medium Devices Styling */
.md #login-frame {
    width: 100vw;
    height: 100%;
    margin: auto;
    padding: 4%;
    border-radius: 20px;
}

.md .login-content {
    display: block;
    width: 80%;
    height: fit-content;
}

.md #account-links {
    gap: 4vh;
}

.md .container {
    width: 100%;
}

/* Large Devices Styling */
.lg #login-frame {
    width: 100%;
    border-radius: 0px;
}

.lg .container {
    width: 50%;
    height: 100%;
}

.lg .login-content {
    display: block;
    height: fit-content;
    width: 80%;
    transform: scale(0.9);
}

.lg #account-links {
    gap: 3vh;
}

/* Extra Large Devices Styling */
.xl #graphic {
    display: block;
}

.xl .login-content {
    display: block;
    height: fit-content;
    width: 80%;
}

.xl #login-frame {
    width: 100%;
    border-radius: 0px;
    justify-content: center;
    align-items: center;
}

.xl #account-links {
    gap: 2vh;
}

/* Extra Extra Large Devices Styling */
.xxl #login-frame {
    width: 100%;
}

.xxl #graphic {
    display: block;
}

.xxl #account-links {
    gap: 2vh;
}

.xxl .login-content {
    display: block;
    height: fit-content;
    width: 80%;
    max-width: 650px;
}


</style> 