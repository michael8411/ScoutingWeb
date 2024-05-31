import './styling/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './composables/database'

// Initialize Pinia
const pinia = createPinia();

// Create the Vue app
const app = createApp(App)


// Use Pinia, router, and VueFire
app.use(pinia)
app.use(router)
app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ]
})

// Mount the app
app.mount('#app')