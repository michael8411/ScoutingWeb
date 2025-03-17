// database.ts 

import { initializeApp, FirebaseOptions } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore, persistentLocalCache, initializeFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: 'scouting-webapp-eb64e.firebaseapp.com',
  projectId: 'scouting-webapp-eb64e',
  storageBucket: 'scouting-webapp-eb64e.appspot.com',
  messagingSenderId: '2996373214',
  appId: '1:2996373214:web:b077b4312aa9b78c89e44f',
  measurementId: 'G-9FHW5J9K04'
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)
const auth = getAuth(firebaseApp)

// Initialize Firestore with offline persistence using `localCache`
const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache()
})

export { db, firebaseApp, auth, analytics }
