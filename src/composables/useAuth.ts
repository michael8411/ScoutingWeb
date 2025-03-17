// useAuth.ts
import { ref } from 'vue'
import { FirebaseError } from '@firebase/util'
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  AuthErrorCodes,
  UserCredential,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'

export function useAuth() {
  const auth = getAuth() // Ensure this uses the same instance from database.ts
  const authError = ref<FirebaseError | null>(null)
  const currentUser = ref(auth.currentUser)

  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })

  const signInWithEmail = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<UserCredential | null> => {
    try {
      if (rememberMe) {
        await setPersistence(auth, browserLocalPersistence)
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      authError.value = null
      return userCredential
    } catch (err) {
      authError.value = err as FirebaseError
      console.error('SignIn Error:', authError.value.message)
      return null
    }
  }

  const signInWithProvider = async (provider: GoogleAuthProvider): Promise<void> => {
    try {
      await signInWithRedirect(auth, provider)
      authError.value = null
    } catch (err) {
      authError.value = err as FirebaseError
      console.error('Provider SignIn Error:', authError.value.message)
    }
  }

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider()
    await signInWithProvider(provider)
  }

  const signInWithKatyISD = async (): Promise<void> => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ hd: 'katyisd.org' })
    await signInWithProvider(provider)
  }

  const signUpWithEmail = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<UserCredential | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (userCredential.user) {
        const displayName = `${firstName.trim()} ${lastName.trim()}`
        await updateProfile(userCredential.user, { displayName })
      }
      authError.value = null
      return userCredential
    } catch (error) {
      authError.value = error as FirebaseError
      console.error('SignUp Error:', authError.value.message)
      return null
    }
  }

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email)
      authError.value = null
    } catch (err) {
      authError.value = err as FirebaseError
      console.error('Password Reset Error:', authError.value.message)
    }
  }

  const signOutUser = async (): Promise<void> => {
    try {
      await signOut(auth)
      currentUser.value = null
      authError.value = null
    } catch (err) {
      authError.value = err as FirebaseError
      console.error('SignOut Error:', authError.value.message)
    }
  }

  const getErrorMessage = (): string => {
    if (!authError.value) return ''
    switch (authError.value.code) {
      case AuthErrorCodes.INVALID_EMAIL:
        return 'Invalid email format'
      case AuthErrorCodes.USER_DELETED:
        return 'User not found'
      case AuthErrorCodes.INVALID_PASSWORD:
        return 'Incorrect password'
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        return 'Too many failed login attempts. Please try again later.'
      default:
        return 'Authentication failed'
    }
  }

  const clearAuthError = () => {
    authError.value = null
  }

  return {
    signInWithEmail,
    signInWithGoogle,
    signInWithKatyISD,
    sendPasswordReset,
    signOutUser,
    signUpWithEmail,
    authError,
    getErrorMessage,
    clearAuthError,
    currentUser
  }
}
