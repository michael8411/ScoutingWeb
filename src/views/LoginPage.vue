
<template>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <div :class="{
        'mobile-view': isMobile,
        'tablet-view': isTablet,
        'laptop-view': isLaptop,
        'desktop-view': isDesktop
    }">
        <div id="background"></div>
        <div id="base">
            <div id="gradient"></div>
            <!-- Header Section -->
            <header id="header">
                <img id="team-logo" src="../assets/images/cryptonite_logo.png" alt="Cryptonite Logo">
            </header>
            <!-- Main Content Section -->
            <main id="main-content">
                <div class="container">
                    <div id="login-section">
                        <!-- Navigation for Sign In/Sign Up -->
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
                                    <input id="signin-email" class="form-input" type="email" placeholder="Enter your email"
                                        v-model="email" />
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
                                    <div id="alt-login-divider"><span>OR</span></div>
                                    <StyledButton label="Continue with Katy ISD" :onClick="handleGoogleSignIn"></StyledButton>
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
                                    <input id="signup-email" class="form-input" type="email" placeholder="Enter your email"
                                        v-model="email" />
                                    <div class="error-space">{{ computedEmailError }}</div>
                                </fieldset>

                                <!-- Password Input Group for Sign In -->
                                <fieldset class="form-group">
                                    <label for="signup-password" class="form-label">Password</label>
                                    <input type="password" id="signup-password" class="form-input"
                                        placeholder="Enter password" v-model="password" />
                                    <div class="error-space">{{ computedPasswordError }}</div>
                                </fieldset>

                                <!-- Action Buttons for Sign In -->
                                <div id="auth-buttons">
                                    <StyledButton label="Register" :onClick="handleEmailSignIn"></StyledButton>
                                    <div id="alt-login-divider"><span>OR</span></div>
                                    <StyledButton label="Continue with Katy ISD" :onClick="handleGoogleSignIn">
                                    </StyledButton>
                                </div>

                                <!-- Account Links for Sign In -->
                                <nav id="account-links">

                                    <router-link to="/reset" class="link-style">Forgot Password?</router-link>
                                </nav>
                            </form>

                        </div>
                    </div>
                </div>

                <!-- Graphic Section -->
                <aside id="graphic">
                    <img id="glitch_logo" src="../assets/gifs/glitchSlow.gif" alt="Glitch Logo">
                </aside>
            </main>
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
const breakpoints = {
    mobile: 450,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity,
};
const { isMobile, isTablet, isLaptop, isDesktop } = useBreakpoints(breakpoints);

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
    display: grid;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-font-smoothing: subpixel-antialiased;
    will-change: transform, opacity;
}

/* Container Styles */
.container {
    height: 100%;
}

/* Authentication Section Styles */
#auth-section,
#register-section {
    position: absolute;
    width: 100%;
    height: fit-content;
    padding-left: 1vh;
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

.frame.signin-active #auth-section,
.frame.signup-active #register-section,
.frame.signin-active #register-section,
.frame.signup-active #auth-section {
    will-change: transform, opacity;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
}

/* Active and Inactive State Transitions */
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

/* Navigation Link Active State */
.nav .links li.signin-active a.signin-btn,
.nav .links li.signup-active a.signup-btn {
    opacity: 1;
    padding-bottom: 15%;

}

.nav a::after,
.nav .links li.signin-active a.signin-btn::after,
.nav .links li.signup-active a.signup-btn::after {
    background-color: #6b6b6b;
    width: 100%;


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
    gap: 2.5vh;
    padding: 0;
    font-family: 'Lemon/Milk', 'Futura PT';
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

/* Logo Styling */
/* Logo Styling */
#team-logo {
    height: 70px;
    z-index: 2;
    margin-top: 10%;
    margin-left: 10%;
}

/* Header Styling */
#header {
    display: flex;
    width: fit-content;
    height: fit-content;
}

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
    gap: 15%;
    min-height: fit-content;
    align-items: center;
}

/* Login Section Styling */
#login-section {

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 95%;
    height: 60vh;
    min-height: fit-content;
    min-width: 100px;
    border-radius: 30px;
    --x: 50%;
    --y: 50%;
    border: 3px solid transparent;
    transition: background-position 0.3s, border-color 0.3s;
    background: linear-gradient(#010101, #000000) padding-box, radial-gradient(farthest-corner at var(--x) var(--y), #616161, #0e0e0e) border-box;
    scale: 0.9;
    object-fit: scale-down;
    position: relative;
    overflow: hidden;
}

/* Login Title Styling */
#login-title {
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 20px;
    z-index: 1;
    width: 350px;
    height: fit-content;
    font-family: 'Lemon/Milk', 'Futura PT';
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
    flex-direction: column;
    font-family: 'Futura PT';
    z-index: 1;
    width: 100%;
    height: fit-content;
    margin-bottom: 20px;
}

.form-group input:-webkit-autofill,
.form-group input:-webkit-autofill:hover,
.form-group input:-webkit-autofill:focus,
.form-group input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #b7b7b7 inset !important;
    /* Light gray background */
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 10%;
    gap: 5vh;
}

/* OR Separator Styling */
#alt-login-divider {
    position: relative;
    text-align: center;
    width: 100%;
    color: #8b8b94;
}

#alt-login-divider span {
    background-color: rgb(3, 3, 3);
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

/* Signup Styling */
#signup {
    margin-block-start: 0;
    margin-block-end: 0;
}

/* Graphic Styling */
#graphic {
    display: flex;
    flex-direction: column;
    max-height: 60%;
    height: 50vh;
    background-color: black;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    --x: 50%;
    --y: 50%;
    border: 3px solid transparent;
    transition: background-position 0.3s, border-color 0.3s;
    background: linear-gradient(#000000, #000000) padding-box, radial-gradient(farthest-corner at var(--x) var(--y), #616161, #0e0e0e) border-box;
    max-width: 500px;
    max-height: 800px;
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

/* Base Styling */


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

#base {
    display: flex;
    flex-direction: column;
    height: 90vh;
    min-height: fit-content;
    width: 90vw;
    margin: auto;
    border-radius: 40px;
    background-color: #050505;
    position: relative;
    --x: 50%;
    --y: 50%;
    border-top: 4px dotted transparent;
    border-right: 1px none transparent;
    border-bottom: 1px none transparent;
    border-left: 4px double transparent;
    transition: background-position 0.3s, border-color 0.3s;
    background: linear-gradient(#0b0b0b, #070707) padding-box,
        radial-gradient(farthest-corner at var(--x) var(--y), #848484, #020202) border-box;
}

#base::before,
#base::after {
    content: '';
    position: absolute;
    border-radius: 42px;
}

#base::before {
    width: 100%;
    height: 100%;
    left: 0.35vh;
    right: 0.35vh;
    top: 0.35vh;
    bottom: 0.35vh;
    background-image: linear-gradient(var(--a), #000000, #3a3939, #0e0e0e 43%, #0c300c);
    z-index: -2;
    animation: rotate-gradient 20s linear infinite;
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
    animation: rotate-gradient 20s linear infinite;

}

#gradient {
    --rotate-angle: 360deg;
    position: absolute;
    height: calc(100% - 20px);
    width: calc(100% - 10px);
    top: 20px;
    left: 15px;
    background-image: linear-gradient(var(--rotate-angle), #0e460e, #3a3939, #0e0e0e 43%, #0c300c);
    filter: blur(0.5rem);
    border-radius: 25px;
    opacity: 0.5;
    z-index: -1;
    transition: filter 0.3s, opacity 0.3s;
    animation: rotate-gradient 20s linear infinite;
}

/* Mobile View */

.mobile-view #header #team-logo {
    display: none;
}

.mobile-view .frame {
    justify-content: center;
    align-items: center;
    margin-bottom: 100%;
}

.mobile-view #login-section {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: none;
    background: none;
    border-radius: 20px;
    height: 100%;
    width: 100%;

    box-sizing: border-box;
    overflow-y: auto;
}

.mobile-view #auth-section,
.mobile-view #register-section {
    height: 10%;
    align-items: center;
}

.mobile-view .nav {
    padding-left: 1vh;

}

.mobile-view .form-group {
    height: fit-content;
}

.mobile-view #base {
    height: 100%;
    width: 100%;
    margin: 0px;
    border: none;
    border-radius: 0px;
    background-color: black;
}

.mobile-view #base::before,
.mobile-view #base::after {
    width: 0;
    height: 0;
    background-image: none;
    filter: none;
    opacity: 0;
    animation: none;
}

.mobile-view #main-content {
    padding: 0px;
    width: 40vh;
}

.mobile-view #login-title {
    max-width: 350px;
    width: 80%;
    font-size: 48px;
    margin-block-start: 0em;
    margin-block-end: 0.5em;
}

.mobile-view #graphic {
    display: none;
}


.mobile-view #main-content {
    flex-direction: column;
    gap: 5%;
    padding-left: 5%;
    padding-right: 5%;
}

/* Tablet View */
.tablet-view #team-logo {
    height: 70px;
    margin-top: 7%;
    margin-left: 7%;
}

.tablet-view #main-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.tablet-view #login-section {
    width: 100%;
    height: 85vh;
    margin: auto;
    padding: 5%;
    border-radius: 25px;

}

.tablet-view .nav {
    padding-left: 1vh;

}

.tablet-view .frame {
    height: 100%;
    width: 100%;
    justify-content: center;
    background-color: transparent;
}

.tablet-view .container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    border: none;
    transform: scale(0.9);
}

.tablet-view #graphic {
    display: none;
}

.tablet-view #account-links {
    padding-top: 1vh;
    gap: 5vh;
}


.laptop-view #team-logo {
    height: 65px;
    margin-top: 5%;
    margin-left: 5%;
}

.laptop-view #login-section {
    width: 90%;
    height: clamp(60vh, 80vh, 800px);
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.laptop-view #login-section>* {
    transform: scale(0.8);
}


.laptop-view .nav {
    padding-left: 1vh;
}

.laptop-view .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150rem;
    height: 90vh;
    border-radius: 30px;
    transform: scale(0.8);
}

.laptop-view #main-content {
    padding: 3em;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10%;
}

.laptop-view #graphic {
    justify-self: center;
    align-self: center;
    height: clamp(20vh, 40vh, 800px);

}

.desktop-view #team-logo {
    height: 65px;
    margin-top: 5%;
    margin-left: 5%;
}
/* Desktop View */
.desktop-view .nav {
    padding-left: 1vh;
    padding-top: 20%;

}

.desktop-view #base {
    height: 80vh;
    width: 90vw;
}


.desktop-view .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70%;
    width: fit-content;
}

.desktop-view #main-content {
    gap: 15%;
}

.desktop-view #login-section {
    width: 650px;
    height: 85vh;
    border-radius: 30px;
    min-height: 300px;
    max-height: 750px;
    padding-left: 15%;
    padding-right: 15%;
    overflow-y: auto;
}
</style> 