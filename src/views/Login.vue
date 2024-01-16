<template>
    
    <head>
        <meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
    </head>
    <div id="box">
        <img id="circle_logo" src="../assets/images/cryptonite_logo.png">
        <div id="auth">
            <h1 id="login_title">Scouting Form</h1>
                <div class="Eform-group">
                    <label for="email" class="form-label">Email</label>
                    <div class="form-group__input">
                        <input required id="email" class="form-input" type="email" pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}"
                            title="Email must be verified" placeholder="Enter your email" v-model="email" />
                    </div>
                    <div class="error-space">
                        <div :class="{ error: emailErrorMessage }">{{ emailErrorMessage }}</div>
                    </div>
                </div>
                <div class="Pform-group">
                    <label for="password" class="form-label">Password</label>
                    <div class="form-group__input">
                        <input required type="password" id="password" class="form-input" placeholder="Enter password"
                            v-model="password" />
                    </div>
                    <div class="error-space">
                        <div :class="{ error: pswdErrorMessage }">{{ pswdErrorMessage }}</div>
                    </div>
                </div>
            <Button label="Sign in" :onClick="emailSignIn"></Button>
            <div id="or">
                <span>OR</span>
            </div>
            <Button label="Continue with Katy ISD" :onClick="googleSignIn"></Button>
            <div style="display: flex; align-items: center; flex-direction: column;">
                <div>
                    <span>Don't have an account? </span>
                    <router-link to="/signup" class="link-style">Sign up</router-link>
                </div>
                <router-link to="/reset" class="link-style">Forgot Password?</router-link>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
// Import the required functions and components
import { ref, watch } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider, AuthErrorCodes } from "firebase/auth";
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue'

// Set up the refs
const emailErrorMessage = ref('');
const pswdErrorMessage = ref('');

// Set up the auth
const auth = getAuth();

// Set up the router
const router = useRouter();
const password = ref('');
const email = ref('');

// Watch the password and email for empty fields
watch([email, password], ([newEmail, newPswd], [oldEmail, oldPswd]) => {
    if(newEmail == "" && oldEmail != ""){
        emailErrorMessage.value = "";
    }
    if (newPswd == "" && oldPswd != "") {
        pswdErrorMessage.value = "";
    }
});

const emailSignIn = async () => {
    const emailInput = document.querySelector('#email') as HTMLInputElement;
    const passwordInput = document.querySelector('#password') as HTMLInputElement;

    if (!emailInput.checkValidity()) {
        emailErrorMessage.value = "Invalid Email";
        return;
    }
    if (!passwordInput.checkValidity()) {
        pswdErrorMessage.value = "Invalid Password";
        return;
    }

    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;

    signInWithEmailAndPassword(auth, userEmail, userPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            router.push('/scouting');
        })
        .catch((error) => {
            switch (error.code) {
                case AuthErrorCodes.INVALID_EMAIL:
                    emailErrorMessage.value = "Wrong Email";
                    break;
                case AuthErrorCodes.INVALID_PASSWORD:
                    pswdErrorMessage.value = "Wrong Password";
                    break;
                default:
                    console.log("Sign in failed: ", error.code);
                    break;
            }
        });
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
    --accent: #8b8b94;
    --boxBg: #19191a;
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
    margin-left: 5%;
    margin-right: 5%;
    padding: 20px;
}

/* Logo Styling */
#circle_logo {
    height: 80px;
    width: auto;
    z-index: 2;
    left: 2%;
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

#or span{
    background-color: #19191a;
    padding-left: 12px;
    padding-right: 12px;
    display: inline-block;
    line-height: 24px;
    position: relative;
    z-index: 1;
}

#or::before{
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
    border: 2px solid #8b8b94;
    color: var(--baseFg);
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
.link-style{
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
    color: var(--color);
    font-size: 1.25rem;
    z-index: 1;
    height:20px;
    line-height:20px;
    margin-bottom: 10px;
}

.form-group__input{
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

/* Error Message Styling */
.error{
    color: rgb(235, 53, 53);
}
.error-space{
    height: 10px;
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
    0% { --a: 0deg; }
    100% { --a: 360deg; }
}

/* Pseudo-elements for the box */
#box::before, #box::after {
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
  background-image: linear-gradient(
        var(--a), 
        #32CD32, 
        #3a3939,
        #0e0e0e 43%, 
        #32CD32 
    );
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
    background-image: linear-gradient(
        var(--a), 
        #32CD32, 
        #3a3939, 
        #0e0e0e 43%, 
        #32CD32 
    );
    border-radius: 8px;
    filter: blur(15px); 
    z-index: -1; 
    opacity: 0.7; 
    animation: box-rotate 2.5s linear infinite;
}


/* Screen Sizing */

@media only screen and (max-height: 800px){
    #box {
        height: auto;
        margin-top: 5%;
        margin-bottom: 5%;
        align-self: first baseline;
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
