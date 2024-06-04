<template>
  <div class="nav-drawer" :style="{ left: drawerVisible ? '0' : '-300px' }">
    <!--Header-->
    <header>
      <img class="circle-logo" src="../assets/images/624_circle_logo.png" alt="Logo" />
      <div class="user-info">
        <p class="user-email">{{ userData ? userData.email.toUpperCase() : 'EMAIL@STUDENTS.KATYISD.ORG' }}</p>
        <p class="user-name">{{ userData ? userData.userName : 'User Name' }}</p>
      </div>
      <button class="inner-nav-button" @click="drawerVisible = false">
        <SvgComponent name="nav-icon" class="nav-icon" />
      </button>
    </header>
    <div class="line"></div>

    <!--Page Routes-->
    <div class="routes">
      <router-link to="/scouting" class="route-link">
        <SvgComponent name="scouting-icon" class="icon" />
        Scouting
      </router-link>
      <router-link to="/sheets" class="route-link">
        <SvgComponent name="sheets-icon" class="icon" />
        Sheets
      </router-link>
      <router-link to="/admin" class="route-link">
        <SvgComponent name="admin-icon" class="icon" />
        Admin
      </router-link>
    </div>

    <!--Admin Section-->
    <div v-if="userData && userData.admin" class="admin-section">
      <div class="admins-header">
        <p class="admins-title">Admins</p>
        <button class="admin-button" @click="adminPopupVisible = true">
          <SvgComponent name="plus-icon" class="plus-icon" />
        </button>
      </div>
      <div class="line"></div>

      <div class="admin-list">
        <div class="admin-user" v-for="user in adminUsers" :key="user.uid">
          <SvgComponent name="activity-indicator" class="activity-icon" :class="{ online: user.isOnline }" />
          {{user.userName}}
          <button v-show="userData.id != user.id && drawerVisible && adminPopupVisible" class="admin-remove-button"
            @click="removeAdmin(user)">
            <SvgComponent name="plus-icon" class="plus-icon" style="transform: rotate(45deg)" />
          </button>
        </div>
      </div>

      <Teleport to="body">
        <Transition name="fade">
          <div v-show="drawerVisible && adminPopupVisible" class="admin-popup">
            <button class="admin-popup-close" @click="adminPopupVisible = false">
              <SvgComponent name="plus-icon" class="plus-icon" style="transform: rotate(45deg)" />
            </button>
            <p>Assign Admins</p>
            <div class="general-user-list">
              <div class="general-user" v-for="user in generalUsers" :key="user.uid">
                <p class="general-user-name">{{user.userName}}</p>
                <button class="admin-assign-button" @click="assignAdmin(user)">Add</button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>

    <!--Logout Button-->
    <button class="logout-button" :onclick="logout">
      <SvgComponent name="logout-icon" class="logout-icon" />
      Logout
    </button>
  </div>

  <!--Nav Button Outside Drawer-->
  <button class="outer-nav-button" @click="drawerVisible = true">
    <SvgComponent name="nav-icon" class="nav-icon" />
  </button>
</template>

<script setup lang="ts">
import { getAuth } from 'firebase/auth'
import SvgComponent from './SvgComponent.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { db } from '../composables/database'
import 'firebase/firestore'
import { collection, query, where, doc, DocumentData, setDoc } from 'firebase/firestore'
import { useCollection, useDocument, useCurrentUser } from 'vuefire'

const drawerVisible = ref(true)
const adminPopupVisible = ref(false)

const auth = getAuth();
const user = useCurrentUser();
const userData = useDocument(() => user.value ? doc(db, "users", user.value.uid) : null);

const adminUsers = useCollection(query(
  collection(db, 'users'),
  where('admin', '==', true)
));

const generalUsers = useCollection(query(
  collection(db, 'users'),
  where('admin', '==', false)
));

const router = useRouter()
const logout = async () => {
  await auth.signOut()
  router.push('/login')
}

const assignAdmin = (user: DocumentData) => {
  setDoc(doc(db, 'users', user.id), { admin: true }, { merge: true });
}

const removeAdmin = (user: DocumentData) => {
  setDoc(doc(db, 'users', user.id), { admin: false }, { merge: true });
}

</script>

<style scoped>
/* Transitions */
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-active {
  transition: opacity ease-in .7s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.outer-nav-button {
  position: absolute;
  left: 25px;
  top: 25px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.admin-remove-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
  padding: 0;
  margin-left: 5px;
  animation: tilt-shaking 0.4s infinite;
}

@keyframes tilt-shaking {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(5deg);
  }

  50% {
    transform: rotate(0eg);
  }

  75% {
    transform: rotate(-5deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.admin-popup {
  background-color: #1f1f1f;
  position: fixed;
  z-index: 999;
  top: 0;
  bottom: 0;
  margin-bottom: auto;
  margin-top: auto;
  left: 325px;
  width: 175px;
  height: 225px;
  text-align: center;
  border-radius: 10px;
}

.admin-popup-close {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
  position: absolute;
  top: 5px;
  right: 0;
}

.general-user-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.general-user {
  display: flex;
  justify-content: center;
  gap: 10px;
  white-space: nowrap;
  width: 95%;
}

.general-user-name {
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.admin-assign-button {
  background-color: #033403;
  color: #e8e8e8b2;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
}

.nav-drawer {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 0;
  overflow: hidden;
  z-index: 200;
  transition: all 0.7s ease-in-out;
  height: 100%;
  background-color: black;
  width: 300px;
}

header {
  display: flex;
  align-items: center;
  padding-top: 20px;
  padding-left: 20px;
  padding-bottom: 10px;
  flex-shrink: 0;
}

.circle-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
}

.user-info {
  width: 60%;
  margin: 0;
  white-space: nowrap;
}

.user-name {
  font-size: 20px;
  font-weight: 400;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
}

.user-email {
  font-size: 10px;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #6f6f6f;
}

.line {
  width: 300px;
  height: 1px;
  opacity: 0.32;
  background: radial-gradient(50% 50% at 50% 50%, #d5d5d5 0%, rgba(218, 218, 218, 0) 100%);
}

.inner-nav-button {
  position: absolute;
  top: 20px;
  right: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.routes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 30%;
  max-height: 300px;
  width: 240px;
  min-width: fit-content;
  padding-left: 40px;
}

.routes .route-link:hover {
  background-color: #131313;
}

.routes .route-link.router-link-active {
  color: white;
  background-color: #131313;
}

.routes .route-link.router-link-active .icon {
  color: white;
}

.route-link {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  border-radius: 12px;
  padding: 16px 20px;
  color: rgb(93, 93, 93);
  margin-bottom: 5px;
}

.nav-icon {
  width: 30px;
  height: 30px;
}

.admins-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  align-items: center;
  color: rgb(93, 93, 93);
  padding-left: 20px;
  padding-right: 10px;
}

.admin-section {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.admins-title {
  margin: 0;
  padding: 0px 4px 0px 20px;
  white-space: nowrap;
}

.admin-button {
  display: flex;
  align-items: center;
  justify-self: flex-end;
  cursor: pointer;
  background-color: transparent;
  border: none;
  white-space: nowrap;
}

.plus-icon {
  color: white;
}

.admin-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

.admin-user {
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  align-items: center;
}

.activity-icon {
  color: rgb(93, 93, 93);
  margin-right: 10px;
}

.online {
  color: #00ff00;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 240px;
  height: 50px;
  margin: 0 auto;
  margin-top: auto;
  background-color: transparent;
  color: rgb(194, 194, 194);
  border: none;
  cursor: pointer;
  position: absolute;
  bottom: 15px;
  left: 30px;
  font-size: 20px;
  font-weight: 400;
  white-space: nowrap;
  overflow: visible;
}

.logout-icon {
  width: 25px;
  height: 25px;
  flex-shrink: 0;
}
</style>
