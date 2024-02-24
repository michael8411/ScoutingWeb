// useAuth.ts
import { ref } from 'vue';
import { FirebaseError } from '@firebase/util';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  AuthErrorCodes,
  UserCredential,
} from 'firebase/auth';

export function useAuth() {
  const auth = getAuth();
  const authError = ref<FirebaseError | null>(null);

  const signInWithEmail = async (email: string, password: string): Promise<UserCredential | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      authError.value = null; 
      return userCredential;
    } catch (err) {
      authError.value = err as FirebaseError; 
      return null;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ 'hd': 'students.katyisd.org' });
    try {
      await signInWithRedirect(auth, provider);
      authError.value = null; 
    } catch (err) {
      authError.value = err as FirebaseError; 
    }
  };

  const getErrorMessage = (): string => {
    if (!authError.value) return '';
    switch (authError.value.code) {
      case AuthErrorCodes.INVALID_EMAIL:
        return "Invalid email format";
      case AuthErrorCodes.USER_DELETED:
        return "User not found";
      case AuthErrorCodes.INVALID_PASSWORD:
        return "Incorrect password";
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        return "Too many failed login attempts. Please try again later.";
      default:
        return "Authentication failed";
    }
  };

  const clearAuthError = () => {
    authError.value = null;
  };

  return {
    signInWithEmail,
    signInWithGoogle,
    authError,
    getErrorMessage,
    clearAuthError
  };
}