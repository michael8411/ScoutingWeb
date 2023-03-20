import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/Login.vue';
import ScoutingView from '../views/Scouting.vue';

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/scouting',
        name: 'Scouting',
        component: ScoutingView,
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/login',
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;