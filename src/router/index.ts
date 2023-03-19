import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import ScoutingView from '../views/Scouting.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/Login',
            name: 'Login',
            component: () => LoginView
        },
        {
            path: '/Scouting',
            name: 'Scouting',
            component: () => ScoutingView
        }
    ]
})
export default router