<!--RegistrationForm.vue-->
<!-- RegistrationForm.vue -->
<template>
  <form class="form-auth" id="register-section" @submit.prevent="handleSubmit">
    <InputField
      id="signup-FirstName"
      label="First Name"
      type="text"
      placeholder="Enter your first name"
      v-model="firstName"
      :error-message="computedFirstNameError"
    />
    <InputField
      id="signup-LastName"
      label="Last Name"
      type="text"
      placeholder="Enter your last name"
      v-model="lastName"
      :error-message="computedLastNameError"
    />
    <InputField
      id="signup-email"
      label="Email"
      type="email"
      placeholder="Enter your email"
      v-model="email"
      :error-message="computedEmailError"
    />
    <InputField
      id="signup-password"
      label="Password"
      type="password"
      placeholder="Enter password"
      v-model="password"
      :error-message="computedPasswordError"
      :hideText="true"
    />
    <InputField
      id="signup-repeat-password"
      label="Repeat Password"
      type="password"
      placeholder="Repeat password"
      v-model="repeatPassword"
      :error-message="computedRepeatPasswordError"
    />
    <div id="auth-buttons">
      <div id="alt-login-divider"><span></span></div>
      <StyledButton label="Register" :onClick="handleSubmit"></StyledButton>
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

// State for the registration form
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')

// Pull in signUpWithEmail from your composable
const { 
  signUpWithEmail, 
  authError, 
  getErrorMessage, 
  clearAuthError 
} = useAuth()

const router = useRouter()

// ---- COMPUTED ERROR MESSAGES ----
// If you want specialized error messages for each field, you can use a pattern like this:
const computedFirstNameError = computed(() => {
  if (!authError.value) return ''
  // If your backend or validation sets specific error codes for firstName, handle them here;
  // otherwise leave as generic or remove if unneeded.
  return authError.value.code.includes('firstName') ? getErrorMessage() : ''
})

const computedLastNameError = computed(() => {
  if (!authError.value) return ''
  // Similarly, handle lastName-specific error codes if needed.
  return authError.value.code.includes('lastName') ? getErrorMessage() : ''
})

const computedEmailError = computed(() => {
  if (!authError.value) return ''
  // Common Firebase errors might contain 'email' or 'user-not-found'
  return authError.value.code.includes('email') || authError.value.code.includes('user-not-found')
    ? getErrorMessage()
    : ''
})

const computedPasswordError = computed(() => {
  if (!authError.value) return ''
  return authError.value.code.includes('password') ? getErrorMessage() : ''
})

const computedRepeatPasswordError = computed(() => {
  if (password.value !== repeatPassword.value && repeatPassword.value !== '') {
    return 'Passwords do not match'
  }
  return ''
})

// ---- FORM SUBMISSION ----
const handleSubmit = async () => {
  // Clear any previous errors before starting
  clearAuthError()

  // Basic checks for empty fields
  if (!firstName.value || !lastName.value || !email.value || !password.value || !repeatPassword.value) {
    authError.value = { code: 'auth/missing-fields' } as FirebaseError
    return
  }

  // Check if passwords match
  if (password.value !== repeatPassword.value) {
    authError.value = { code: 'auth/password-mismatch' } as FirebaseError
    return
  }

  try {
    // Pass firstName and lastName separately
    const userCredential = await signUpWithEmail(
      firstName.value,
      lastName.value,
      email.value,
      password.value
    )

    if (userCredential) {
      await router.push('/scouting')
    }
  } catch (error) {
    authError.value = error as FirebaseError
  }
}
</script>


<style scoped>
/* Authentication Form Styles */
.form-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Form Group Styles */
.form-group {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  font-family: 'Poppins-Black', sans-serif;
  z-index: 1;
  width: 100%;
  height: fit-content;
  margin-bottom: 20px;
  border: none;
}

/* Form Label Styles */
.form-label {
  display: block;
  font-family: 'Poppins-Black', sans-serif;
  font-size: 18px;
  color: #fff;
  font-weight: normal;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Form Input Styles */
.form-input {
  width: 100%;
  padding: 12px 16px;
  font-family: 'Poppins-SemiBold', sans-serif;
  font-size: 20px;
  color: #8b8b94;
  background-color: transparent;
  border-top: 0px solid #6c6c6c;
  border-right: 0px solid #6c6c6c;
  border-bottom: 2px solid #6c6c6c;
  border-left: 0px solid #6c6c6c;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.form-input::placeholder {
  color: #999999;
}

.form-input::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: #ffffff;
  transform-origin: center;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.form-input:focus::after {
  transform: scaleX(1);
}

/* Username Input Styles */
#signup-username {
  width: 100%;
  padding: 12px 16px;
  font-family: 'Poppins-SemiBold', sans-serif;
  font-size: 20px;
  color: #8b8b94;
  background-color: transparent;
  border-top: 0px solid #6c6c6c;
  border-right: 0px solid #6c6c6c;
  border-bottom: 2px solid #6c6c6c;
  border-left: 0px solid #6c6c6c;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

#signup-username:focus {
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

#signup-username::placeholder {
  color: #999999;
}

#signup-username::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: #ffffff;
  transform-origin: center;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

#signup-username:focus::after {
  transform: scaleX(1);
}

/* Repeat Password Input Styles */
#signup-repeat-password {
  width: 100%;
  padding: 12px 16px;
  font-family: 'Poppins-SemiBold', sans-serif;
  font-size: 20px;
  color: #8b8b94;
  background-color: transparent;
  border-top: 0px solid #6c6c6c;
  border-right: 0px solid #6c6c6c;
  border-bottom: 2px solid #6c6c6c;
  border-left: 0px solid #6c6c6c;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

#signup-repeat-password:focus {
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

#signup-repeat-password::placeholder {
  color: #999999;
}

#signup-repeat-password::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: #ffffff;
  transform-origin: center;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

#signup-repeat-password:focus::after {
  transform: scaleX(1);
}

/* Remember Me Checkbox Styles */
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
  font-size: 16px;
}

/* Forgot Password Link Styles */
.link-style {
  color: #32cd32;
  text-decoration: none;
  font-family: 'Poppins-Medium', sans-serif;
  background-color: transparent;
  font-size: 16px;
}

.link-style:hover {
  text-decoration: underline;
}

/* Remember Me and Forgot Password Container Styles */
.remember-forgot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  width: 100%;
}

/* Authentication Buttons Styles */
#auth-buttons {
  padding-bottom: 10%;
  width: 100%;
}

/* Alternative Authentication Buttons Styles */
#alt-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
}

/* Error Message Styles */
.error-space {
  height: 10px;
  color: rgb(235, 53, 53);
}

/* Responsive Styles */```
/* Responsive Styles */
@media (max-width: 768px) {
  .button-container {
    flex-direction: column;
    gap: 1rem;
  }
}

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
  flex-direction: column;
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
  flex-direction: column;
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
  flex-direction: row;
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
  flex-direction: row;
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
  flex-direction: row;
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
  flex-direction: row;
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
