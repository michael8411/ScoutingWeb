<template>
    <head>
        <meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
    </head>

    <div id="box">
        <img id="circle_logo" src="../assets/images/624_circle_logo.png">
        <h1 id="login_title">Login</h1>
        <div id="auth">
            <form action="" @submit.prevent="signIn">
                <div class="Eform-group">
                    <label for="email" class="form-label">
                        <span aria-hidden="true" class="label__letter" style="--index: 0;">K</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 1;">a</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 2;">t</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 3;">y</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 4;">&nbsp;</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 5;">I</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 6;">S</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 7;">D</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 8;">&nbsp;</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 9;">I</span>
                        <span aria-hidden="true" class="label__letter" style="--index: 10;">D</span>
                        <span class="sr-only">Email</span>
                    </label>
                    <div class="form-group__input" style="position:relative; left:-10px;">
                        <input required id="email" class="form-input"
    pattern="^[A-Za-z][0-9]{7}$" title="Enter your school ID"
    placeholder="Enter your school ID" v-model="email" />
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
                <Button label="Submit"></Button>
            </form>
        </div>
    </div>
</template>
<script setup>
// Import the required functions and components
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue'

// Set up the router
const router = useRouter();
const password = ref('');
const email = ref('');

const signIn = () => {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    if (emailInput.checkValidity() && passwordInput.checkValidity()) {
        const auth = getAuth();
        const userEmail = email.value + "@students.katyisd.org";
        
        createUserWithEmailAndPassword(auth, userEmail, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                router.push('/scouting');
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    signInWithEmailAndPassword(auth, userEmail, password.value)
                        .then((userCredential) => {
                            const user = userCredential.user;
                            router.push('/scouting');
                        })
                        .catch((error) => {
                            console.error("Sign in failed: ", error);
                        });
                } else {
                    console.error("Failed to create user:", error);
                }
            });
    }
    else if(passwordInput.checkValidity()){
    }
};
</script>

<style scoped>
*,
*:after,
*:before {
    box-sizing: border-box;
}

:root {
    --red: hsl(18 100% 50%);
    --green: hsl(130 52% 46%);
    --yellow: hsl(44 83% 53%);
    --blue: hsl(215 100% 53%);
    --grey: hsl(0 0% 45%);
    --text: var(--gray-5);
    --transition: 0.2s;
    --valid: var(--green);
    --invalid: var(--red);
    --focus: var(--indigo-3);
    --blur: var(--indigo-1);
    --disabled: var(--grey);
}

:where(html) {
    color-scheme: none;
}

#box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 600px;
    height: 550px;
    background-color: var(--vt-c-black-soft);
    margin: auto;
    border: 1.5px solid var(--vt-c-green-secondary);
    box-shadow: 0 4px 8px 0 rgba(0, 255, 0, 0.4), 0 6px 20px 0 rgba(0, 255, 0, 0.3);
    position: relative;
    z-index: 0;
}

#circle_logo {
    display: flex;
    position: absolute;
    overflow: visible;
    height: 140px;
    width: auto;
    margin-left: auto;
    margin-right: auto;
    transform: translateY(-50px);
    -webkit-filter: drop-shadow(2px 2px 0 var(--vt-c-green-secondary)) drop-shadow(-2px -2px 0 var(--vt-c-green-secondary));
    filter: drop-shadow(2px 2px 0 var(--vt-c-green-secondary)) drop-shadow(-2px -2px 0 var(--vt-c-green-secondary));
}

Button {
    width: 200px;
}

#login_title {
    font-family: 'Lemon/Milk', 'Futura PT';
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    width: auto;
    height: auto;
    top: 0;
    font-size: 55px;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
}

#auth {
    margin-bottom: auto;
    margin-left: auto;
    margin-right: auto;
}

form {
    display: grid;
    position: relative;
    grid-gap: 2rem;
}

input {

    border-radius: 4px;
    padding: 1rem 2rem;
    font-weight: 400;
    transition: border-color var(--transition);
    position: relative;
    border: transparent;
    background-color: transparent;
    color: var(--baseFg);
    border-bottom: 1px solid var(--color-text);
    left: 5px;
}

input:focus-visible {
    outline-color: var(--color);
}

input::placeholder {
    color: var(--baseFg);
}

.Eform-group,
.Pform-group {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Futura PT';
}

label {
    font-family: 'Futura PT';
    display: flex;
    font-weight: bold;
    padding-right: 1rem;
    transform-style: preserve-3d;
    transition: color var(--transition);
    color: var(--color);
    font-size: 1.25rem;

}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;

}

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


label span {
    display: inline-block;
}

.Eform-group:has(:invalid:not(:focus):not(:placeholder-shown)) .form-group__error,
.Pform-group:has(:invalid:not(:focus):not(:placeholder-shown)) .form-group__error {
    display: block;
}

.Eform-group:has(:focus) .form-group__error,
.Pform-group:has(:focus) .form-group__error,
.Eform-group:has(:placeholder-shown:not(:focus)) .form-group__error,
.Pform-group:has(:placeholder-shown:not(:focus)) .form-group__error {
    display: none;
}

form:valid [type="submit"] {
    background: var(--valid);
    color: var(--gray-1);
}

.form-group__input {
    position: relative;
}

.form-group__error {
    display: none;
    white-space: nowrap;
    position: absolute;
    top: calc(var(--size-2) + 100%);
    left: 50%;
    color: var(--red);
    transform: translate(-50%, 0) scale(1);
    font-size: var(--font-size-0);
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

    .Eform-group:has(:placeholder-shown:not(:focus)),
    .Pform-group:has(:placeholder-shown:not(:focus)),
    .Eform-group:has(:placeholder-shown:not(:focus)),
    .Pform-group:has(:placeholder-shown:not(:focus)) label span {
        animation: none;
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
</style>