import './styling/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { enableIndexedDbPersistence } from "firebase/firestore"; 

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4XGhmHwisYjhrIVoGsOh1tvAQ75bsg8U",
  authDomain: "scouting-web-app-2023.firebaseapp.com",
  projectId: "scouting-web-app-2023",
  storageBucket: "scouting-web-app-2023.appspot.com",
  messagingSenderId: "360081015403",
  appId: "1:360081015403:web:92f78f843f4315e272272e",
  measurementId: "G-048BY8QV6D"
};
const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);

enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

export default db

import router from './router'


const app = createApp(App)
const pinia = createPinia();

app.use(router)
app.use(pinia)

app.mount('#app')
