<template>
    <head>
        <meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
    </head>
    <div id="box">
        <img id="circle_logo" src="../assets/images/cryptonite_logo.png">
        <div id="auth">
            <h1 id="login_title">Sign Up</h1>
            <form action="" @submit.prevent="emailSignIn">
                <div class="Eform-group">
                    <label for="email" class="form-label">
                        <span aria-hidden="true" class="label__letter" style="--index: 0;">E</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 1;">m</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 2;">a</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 3;">i</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 4;">l</span>
                        <span class="sr-only">Email</span>
                    </label>
                    <div class="form-group__input">
                        <input required id="email" class="form-input" type="email"
                            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}" title="Email must be a verified student email"
                            placeholder="Enter your email" v-model="email" />
                        <div class="form-group__error">Invalid Email</div>
                    </div>
                </div>
                <div class="Pform-group">
                    <label for="password" class="form-label">
                        <span aria-hidden="true" class="label__letter" style="--index: 0;">P</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 1;">a</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 2;">s</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 3;">s</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 4;">w</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 5;">o</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 6;">r</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 7;">d</span>
                        <span class="sr-only">Password</span>
                    </label>
                    <div class="form-group__input">
                        <input required type="password" id="password" class="form-input" pattern=".{8,}"
                            title="Password must be at least 8 characters long" placeholder="Enter password"
                            v-model="password" />
                        <div class="form-group__error">Invalid Password</div>
                        <div v-if="error">{{ error }}</div>
                    </div>
                </div>
            </form>
            <Button label="Create an Account" :onClick="emailSignIn"></Button>
            <div id="or">
                <span>OR</span>
            </div>
            <Button label="Continue with Katy ISD" :onClick="googleSignIn"></Button>
            <div style="display: flex; align-items: center; flex-direction: column;">
                <div>
                    <span>Already have an account? </span>
                    <router-link to="/login" class="link-style">Login</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
// Import the required functions and components
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue'

// Set up the auth
const auth = getAuth();

// Set up the router
const router = useRouter();
const password = ref('');
const email = ref('');
const error = ref('')

const emailSignIn = async () => {

    const emailInput = document.querySelector('#email') as HTMLInputElement;
    const passwordInput = document.querySelector('#password') as HTMLInputElement;

    if (!emailInput || !passwordInput) {
        console.log("Null Input Elements");
        return;
    }
    if (!emailInput.checkValidity() && !passwordInput.checkValidity()) {
        console.log("invalid Input")
        return;
    }

    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword)
        const user = userCredential.user;

        router.push('/scouting');
    } catch (error) {
        console.log("Error:" + (error as any).code);
    }
};

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    'hd': 'students.katyisd.org'
});

const googleSignIn = async () => {
    signInWithRedirect(auth, provider)
        .then((result) => {
            router.push('/scouting');
        }).catch((error) => {
            console.error("Sign in failed: ", error);
        });
};
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
}

/* Color Scheme */
:where(html) {
    color-scheme: none;
}

/* Box Styling */
#box {
    background: #19191a;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 800px;
    height: 800px;
    border-radius: 6px;
    position: relative;
    animation: box-rotate 4s linear infinite;
}

/* Logo Styling */
#circle_logo {
    height: 80px;
    width: auto;
    z-index: 2;
    top: 5%;
    left: 0;
    position: absolute;
}

/* Title Styling */
#login_title {
    font-family: 'Lemon/Milk', 'Futura PT';
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
    margin-bottom: auto;
    margin-top: auto;
    z-index: 1;
}

form {
    display: grid;
    gap: 30px;
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
    background-color: #19191a;
    padding-left: 12px;
    padding-right: 12px;
    display: inline-block;
    line-height: 24px;
    position: relative;
    z-index: 1;
}

#or::before {
    content: "";
    height: 1px;
    width: 100%;
    position: absolute;
    left: 0;
    top: 12px;
    background-color: #8b8b94;

}

/* Input Styling */
input {
    border-radius: 4px;
    padding: 1rem 2rem;
    font-weight: 400;
    background-color: transparent;
    color: var(--baseFg);
    border-bottom: 1px solid var(--color-text);
    width: 100%;
}

input:focus-visible {
    outline-color: var(--color);
}

input::placeholder {
    color: var(--baseFg);
}

/* Form Group Styling */
.Eform-group,
.Pform-group {
    display: flex;
    flex-direction: column;
    font-family: 'Futura PT';
    z-index: 1;
    width: 100%;
}

.link-style {
    text-decoration: underline;
    color: #32CD32;
    cursor: pointer;
}

.link-style:hover {
    background-color: transparent;
    box-shadow: none;
}

label {
    display: flex;
    font-weight: bold;
    padding-right: 1rem;
    width: 33%;
    color: var(--color);
    font-size: 1.25rem;
    z-index: 1;
}

.form-group__input {
    align-self: flex-end;
    width: 100%;
}

/* Accessibility Styling */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;

}

/* Validation Styling */
.Eform-group:has(:invalid),
.Pform-group:has(:invalid) {
    --color: var(--invalid);
}

.Eform-group:has(:focus),
.Pform-group:has(:focus) {
    --color: var(--focus);
}

.Eform-group:has(:valid),
.Pform-group:has(:valid) {
    --color: var(--valid);
}

.Eform-group:has(:placeholder-shown),
.Pform-group:has(:placeholder-shown) {
    --color: var(--blur);
}

/* Error Message Styling */
.form-group__error {
    display: none;
    position: absolute;
    top: 100%;
    left: 50%;
    color: var(--red);
    transform: translate(-50%, 0) scale(1);
    font-size: var(--font-size-0);
    white-space: nowrap;
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
#box::before,
#box::after {
    content: '';
    position: absolute;
    border-radius: 20px;

}

#box::before {
    content: "";
    width: 101.5%;
    height: 101.5%;
    top: -0.6vh;
    border-radius: 8px;
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
    width: calc(100% + 20px);
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
}


@media(prefers-reduced-motion: no-preference) {

    .Eform-group:has(:valid) label span,
    .Pform-group:has(:valid) label span {
        animation: wave 0.25s calc(var(--index) * 0.05s);
    }


    .Eform-group:has(:invalid:not(:focus)),
    .Pform-group:has(:invalid:not(:focus)) {
        animation: shake 0.2s;
    }

    .form-group__error {
        animation: show-error 0.1s 0.2s both;
    }

    @keyframes show-error {
        0% {
            transform: translate(-50%, -100%) scale(0);
        }
    }

    @keyframes wave {
        50% {
            transform: translateY(-50%);
        }
    }

    @keyframes shake {

        0%,
        100% {
            transform: translateX(0);
        }

        20%,
        40%,
        60%,
        80% {
            transform: translateX(-2%);
        }

        10%,
        30%,
        50%,
        70%,
        90% {
            transform: translateX(2%);
        }
    }
}

/* Screen Sizing */
@media only screen and (max-width: 800px) {
    #box {
        width: 97%;
        height: auto;
        margin: 0;
        padding: 20px;
        border-radius: 10px;
    }

    #circle_logo {
        height: 80px;
        transform: translateY(10);
        margin-top: -15px;

    }

    #login_title {
        font-size: 30px;
    }

    form {
        width: 100%;
    }

    input {
        padding: 0.5rem 1rem;
    }
}

@media only screen and (max-height: 800px) {
    #box {
        width: 800px;
        height: auto;
        margin-left: 5%;
        margin-right: 5%;
        padding: 20px;
        border-radius: 10px;
    }

    #circle_logo {
        height: 80px;
        position: relative;
        align-self: first baseline;

    }

    #login_title {
        font-size: 45px;
    }

    form {
        width: 100%;
    }

    input {
        padding: 0.5rem 1rem;
    }
}
</style>