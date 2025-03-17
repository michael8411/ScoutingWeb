<template>
  <div class="layout-wrapper">
    <!-- 1) Top Navigation Bar (Glass Morphism) -->
    <header class="top-navbar glass" v-if="!onLoginPage">
      <button class="menu-button" @click="toggleDrawer">
        <SvgComponent :name="drawerVisible ? 'close-icon' : 'nav-icon'" class="menu-icon" />
      </button>
      <div class="app-title"> </div>
    </header>

    <!-- 2) Semi-Transparent Overlay (Appears only when Drawer is open) -->
    <transition name="fade-overlay">
      <div v-if="drawerVisible" class="drawer-overlay" @click="toggleDrawer"></div>
    </transition>

    <!-- 3) Side Nav Drawer (Glass Morphism) -->
    <transition name="slide-drawer">
      <aside v-if="drawerVisible" class="nav-drawer glass">
        <div class="drawer-content">
          <!-- Profile/Logo Area -->
          <div class="profile-section">
            <img
              class="circle-logo"
              src="../assets/images/624_circle_logo.png"
              alt="Logo"
            />
            <div class="user-info">
              <p class="user-email">
                {{ userData?.email?.toUpperCase() || 'EMAIL@STUDENTS.KATYISD.ORG' }}
              </p>
              <p class="user-name">
                {{ userData?.userName || 'User Name' }}
              </p>
            </div>
          </div>
          <div class="divider"></div>

          <!-- Routes -->
          <nav class="drawer-routes">
            <router-link to="/scouting" class="route-link">
              <SvgComponent name="scouting-icon" class="icon" />Scouting
            </router-link>
            <router-link to="/sheets" class="route-link">
              <SvgComponent name="sheets-icon" class="icon" />Sheets
            </router-link>
            <router-link to="/admin" class="route-link">
              <SvgComponent name="admin-icon" class="icon" />Admin
            </router-link>
          </nav>

          <!-- Admin Section -->
          <section v-if="userData?.admin" class="admin-section">
            <div class="admins-header">
              <p class="admins-title">Admins</p>
              <button class="admin-button" @click="adminPopupVisible = true">
                <SvgComponent name="plus-icon" class="plus-icon" />
              </button>
            </div>
            <div class="divider"></div>
            <div class="admin-list">
              <div
                class="admin-user"
                v-for="adm in adminUsers"
                :key="adm.uid"
              >
                <SvgComponent
                  name="activity-indicator"
                  class="activity-icon"
                  :class="{ online: adm.isOnline }"
                />
                {{ adm.userName }}
              </div>
            </div>

            <!-- Admin Popup Modal -->
            <Teleport to="body">
              <transition name="fade-overlay">
                <div
                  v-if="drawerVisible && adminPopupVisible"
                  class="admin-popup glass"
                >
                  <p @click="adminPopupVisible = false">Assign Admins</p>
                  <div
                    class="general-user"
                    v-for="usr in generalUsers"
                    :key="usr.uid"
                  >
                    {{ usr.userName }}
                  </div>
                </div>
              </transition>
            </Teleport>
          </section>

          <!-- Logout Button -->
          <button class="logout-button" @click="logout">
            <SvgComponent name="logout-icon" class="logout-icon" />
            Logout
          </button>
        </div>
      </aside>
    </transition>

    <!-- 4) Main Content Slot (Everything else in your app goes here) -->

  </div>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAuth } from 'firebase/auth'
import SvgComponent from './SvgComponent.vue'
import { db } from '../composables/database'
import { useDocument, useCollection, useCurrentUser } from 'vuefire'
import { doc, collection, query, where } from 'firebase/firestore'

/* 
  Reactive states 
*/


const drawerVisible = ref(false)
const adminPopupVisible = ref(false)

/* 
  Firebase & user data 
*/
const auth = getAuth()
const user = useCurrentUser()
const userData = useDocument(() =>
  user.value ? doc(db, 'users', user.value.uid) : null
)

/* 
  Admin / general users 
*/
const adminUsers = useCollection(query(collection(db, 'users'), where('admin', '==', true)))
const generalUsers = useCollection(query(collection(db, 'users'), where('admin', '==', false)))

/* 
  Router + logout 
*/
const router = useRouter()
const route = useRoute()

// Computeed property to check current route
const onLoginPage = computed(() => route.name === 'login')

async function logout() {
  await auth.signOut()
  router.push('/login')
}

/* 
  Toggle drawer function 
*/
function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value
}
</script>

<style scoped>
/* 
  ----------------------------
  1) Transitions 
  ----------------------------
*/

.cryptonite-logo {
  width: 5%;
  height: 20vh; /* Maintain aspect ratio */
  max-height: 75%; /* Ensure it fits within the navbar */
}

.slide-drawer
{
  height: 90px;
}

.slide-drawer-enter-active,
.slide-drawer-leave-active {
  transition: transform 0.5s ease;
}
.slide-drawer-enter-from,
.slide-drawer-leave-to {
  transform: translateX(-320px);
}
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.4s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

/* 
  ----------------------------
  2) Layout & Container 
  ----------------------------
*/
.layout-wrapper {
  min-height: 100vh;
  padding-top: 64px; 
  position: relative;
  background-color: #f3f3f3;
  /* ...other existing styles... */
}

/* 
  ----------------------------
  3) Top Navigation Bar 
     (Glass Morphism)
  ----------------------------
*/
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1000;
  background: #1e1e1e; /* Dark background */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Modern shadow */
}
.glass {
  /* Simple glass morphism example */
  background: rgba(43, 42, 42, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  
  /* You can adjust the colors, blur, etc. as you prefer! */
}
.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.menu-icon {
  width: 32px;
  height: 32px;
  color: #ffffff; /* White icon */
  transition: transform 0.2s ease; /* Smooth scaling effect */
}


.app-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 
  ----------------------------
  4) Overlay 
  ----------------------------
*/
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90; /* behind the drawer but above the page content */
}

/* 
  ----------------------------
  5) Navigation Drawer 
     (Glass Morphism)
  ----------------------------
*/
.nav-drawer {
  position: fixed;
  top: 5vh;
  left: 0;
  width: 320px;
  height: 100vh;
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* Glass morphism */
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
}
.drawer-content {
  display: flex;
  flex-direction: column;
  padding: 30px;
}
.profile-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.circle-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 160px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.user-email {
  margin: 0;
  font-size: 0.75rem;
  width: 100%;
  color: #e2e2e2;
}
.user-name {
  margin: 0;
  font-size: 1rem;
  color: #fff;
}
.divider {
  background: linear-gradient(90deg, #ccc, transparent);
  height: 1px;
  width: 100%;
  margin: 10px 0;
  opacity: 0.5;
}

/* 
  ----------------------------
  6) Routes 
  ----------------------------
*/
.drawer-routes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.route-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  padding: 8px 0;
  font-weight: 500;
  color: #fefefe;
  transition: background-color 0.2s ease;
}
.route-link .icon {
  width: 24px;
  height: 24px;
  color: #fff;
}
.route-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.route-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 
  ----------------------------
  7) Admin Section & Popup 
  ----------------------------
*/
.admins-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e2e2e2;
}
.admins-title {
  margin: 0;
  font-size: 1rem;
}
.admin-button {
  background: transparent;
  border: none;
  cursor: pointer;
}
.plus-icon {
  width: 24px;
  height: 24px;
  color: #fff;
}
.admin-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}
.admin-user {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ddd;
}
.activity-icon {
  width: 14px;
  height: 14px;
  color: #999;
}
.online {
  color: #0f0; /* example color for "online" */
}
/* Admin Popup */
.admin-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 240px;
  min-height: 100px;
  padding: 16px;
  transform: translate(-50%, -50%);
  z-index: 999;
  text-align: center;
  color: #fff;
  border-radius: 8px;
}

/* 
  ----------------------------
  8) Logout Button 
  ----------------------------
*/
.logout-button {
  margin-top: auto;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  cursor: pointer;
}
.logout-icon {
  width: 24px;
  height: 24px;
}

/* 
  ----------------------------
  9) Page Content Placeholder
  ----------------------------
*/
.page-content {
  flex: 1;
  padding: 20px;
  /* 
    This is where your main <router-view> or page content appears 
    (below the top navbar). 
  */
}
</style>
