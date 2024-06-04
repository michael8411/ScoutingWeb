import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoginView from '../views/LoginPage.vue';
import ScoutingView from '../views/ScoutingPage.vue';
import SheetsView from '../views/SheetsPage.vue';
import AdminView from '../views/AdminPage.vue';
import { getCurrentUser } from 'vuefire';


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
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/sheets',
        name: 'Sheets',
        component: SheetsView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminView,
        meta: {
            requiresAuth: true
        }
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

router.beforeEach(async (to) => {
    if(to.meta.requiresAuth){
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return{
                path: '/login',
                query: { redirect: to.fullPath },
            };
        }
    }
});

export default router;