import './styling/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Initialize Pinia
const pinia = createPinia();

// Create the Vue app
const app = createApp(App)

// Use Pinia and router
app.use(pinia)
app.use(router)

// Mount the app
app.mount('#app')