<template>
    <div class="nav-drawer" :style="{ width: drawerVisible ? '300px' : '0'}">
        <header>
            <img class=" circle-logo" src="../assets/images/624_circle_logo.png" alt="Logo">
            <div class="user-info">
                <p class="user-email">{{email}}</p>
                <p class="user-name">{{username}}</p>
            </div>
            <button class="inner-nav-button" @click="drawerVisible = false">
                <SvgComponent name="nav-icon" class="nav-icon" />
            </button>
        </header>
        <div class="line"> </div>
        <div class="routes">
            <router-link to="/scouting" class="route-link">
                <SvgComponent name="scouting-icon" class="icon" />
                Scouting
            </router-link>
            <router-link to="/sheets" class="route-link">
                <SvgComponent name="sheets-icon" class="icon" />
                Sheets
            </router-link>
            <router-link v-if="isAdmin" to="/admin" class="route-link">
                <SvgComponent name="admin-icon" class="icon" />
                Admin
            </router-link>
        </div>
        <div class="line"> </div>
        <div class="admins-header">
            <p class="admins-title">Admins</p>
            <button class="admin-button">
                <SvgComponent name="plus-icon" class="plus-icon" />
            </button>
        </div>
        <div class="admin-list">
            <div class="admin-user" v-for="(name, index) in adminUsers" :key="index">
                <SvgComponent name="activity-indicator" class="activity-icon" />{{name}}
            </div>
        </div>
        <button class="logout-button" :onclick="logout">
            <SvgComponent name="logout-icon" class="logout-icon" />
            Logout
        </button>
    </div>
    <button class="outer-nav-button" @click="drawerVisible = true">
        <SvgComponent name="nav-icon" class="nav-icon" />
    </button>
</template>

<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import SvgComponent from './SvgComponent.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { db } from '../composables/database';
import 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';

var drawerVisible = ref(true);

const auth = getAuth();
const user = auth.currentUser;

const email = (user?.email) ? user.email.toUpperCase() : "EMAIL@STUDENTS.KATYISD.ORG";
var username = (user?.displayName) ? user.displayName : "User Name";
var isAdmin = false;

const adminUsers =  ref<string[]>([]);
getDocs(collection(db, 'users')).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        if(doc.data().admin){
            adminUsers.value.push(doc.data().userName);
            if(user?.uid == doc.id){
                isAdmin = true;
            }
        }
        if(doc.id == user?.uid){
            username = doc.data().userName;
        }
    });
});

const router = useRouter();
const logout = () => {
    router.push('/login');
    auth.signOut();
}

</script>

<style scoped>
.outer-nav-button {
    position: absolute;
    left: 0;
    top: 0;
    padding: 1rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.nav-drawer {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    overflow: hidden;
    z-index: 200;
    transition: all 0.3s ease;
    height: 100%;
    background-color: black;
    flex-shrink: 0;
}

header {
    display: flex;
    align-items: center;
    padding-top: 20px;
    padding-left: 20px;
    padding-bottom: 10px;
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

.user-email{
    font-size: 10px;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #6F6F6F;
}

.line{
    width: 100%;
    height: 1px;
    opacity: 0.32;
    background: radial-gradient(50% 50% at 50% 50%, #D5D5D5 0%, rgba(218, 218, 218, 0.00) 100%);
}

.inner-nav-button {
    position: absolute;
    top: 15px;
    right: 10px;
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
    width: 80%;
    min-width: fit-content;
    padding-left: 40px;
}

.routes .route-link:hover{
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

.admins-header{
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    align-items: center;
    color: rgb(93, 93, 93);
    padding-left: 20px;
    padding-right: 10px;
}

.admins-title{
    margin: 0;
    white-space: nowrap;
}

.admin-button{
    display: flex;
    align-items: center;
    justify-self: flex-end;
    cursor: pointer;
    background-color: transparent;
    border: none;
    white-space: nowrap;
}

.plus-icon{
    color: white;
}

.admin-list{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
}

.admin-user{
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
}

.activity-icon{
    color: #00FF00;
    margin-right: 10px;
}

.logout-button{
    display: flex;
    align-items: center;
    gap: 10px;
    width: 80%;
    height: 50px;
    margin: 0 auto;
    margin-top: auto;
    background-color: transparent;
    color: rgb(194, 194, 194);
    border: none;
    cursor: pointer;
    position: absolute;
    bottom: 5%;
    left: 10%;
    font-size: 20px;
    font-weight: 400;
}

.logout-icon{
    width: 25px;
    height: 25px;
}

</style>