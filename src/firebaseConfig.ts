// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseOptions } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Ensure the API key is treated as a string to prevent TypeScript errors
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string, // Ensure it's a string
  authDomain: 'scouting-webapp-eb64e.firebaseapp.com',
  projectId: 'scouting-webapp-eb64e',
  storageBucket: 'scouting-webapp-eb64e.appspot.com',
  messagingSenderId: '2996373214',
  appId: '1:2996373214:web:b077b4312aa9b78c89e44f',
  measurementId: 'G-9FHW5J9K04'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Analytics (Only initialize if in a browser environment)
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export const auth = getAuth(app)
export { app, analytics }
