<template>
    <head>
        <meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
    </head>

    <div>
        <form action=""  @submit.prevent="submit" >
            <div class="Eform-group">
                <label for="email" class="form-label">
                    <span aria-hidden="true" class="label__letter" style="--index: 0;">E</span>
                    <span aria-hidden="true" class="label__letter" style="--index: 1;">m</span>
                    <span aria-hidden="true" class="label__letter" style="--index: 2;">a</span>
                    <span aria-hidden="true" class="label__letter" style="--index: 3;">i</span>
                    <span aria-hidden="true" class="label__letter" style="--index: 4;">l</span>
                    <span class="sr-only">Email</span>
                </label>
                <div class="form-group__input" style="position:relative; left:18px;">
                    <input required type="email" id="email" class="form-input"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" title="Enter valid email address"
                        placeholder="Enter valid email address" />
                    <div class="form-group__error">YOU FUCKING IDIOT</div>
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
                        title="Password must be at least 8 characters long" placeholder="Enter password" />
                    <div class="form-group__error">dumbass, thats not a password</div>
                </div>
            </div>
            <button type="submit">Submit</button>
        </form>
        <GoogleLogin :callback="callback" />
    </div>
</template>
<script setup>
// Import the required functions and components
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GoogleLogin from 'vue3-google-login';

// Set up the router
const router = useRouter();

// Create the submit method
const submit = () => {
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');

  if (emailInput.checkValidity() && passwordInput.checkValidity()) {
    router.push('/Scouting');
  }
};
</script>

<script>
export default {
  name: 'EmailForm',
  components: {
    GoogleLogin,
  },
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

body {
    display: grid;
    min-height: 100vh;
    font-family: 'Google Sans', sans-serif, system-ui;
    place-items: center;
    overflow: hidden;
    margin: 0;
    background-color: var(--gray-9);
    font-size: 1rem;
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
    background-color: var(--color-background);
    color: var(--baseFg);
    border-bottom: 1px solid var(--color-text);
    left: 5px;
}

input:focus-visible {
    outline-color: var(--color);
}

input::placeholder {
    color: transparent;
}

.Eform-group,
.Pform-group {
    display: flex;
    justify-content: center;
    align-items: center;
}

label {
    font-family: sans-serif;
    display: flex;
    font-weight: bold;
    padding-right: 1rem;
    transform-style: preserve-3d;
    transition: color var(--transition);
    color: var(--color);
    font-size: 1.25rem;

}

button {
    padding: 1rem 2rem;
    border-radius: 4px;
    border: 0;
    cursor: pointer;
    background: var(--disabled);
    font-weight: bold;
    color: var(--gray-5);
    transition: color var(--transition)
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