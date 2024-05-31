<template>
  <NavDrawer v-if="!isLoginPage" />
  <RouterView />

</template>

<script lang="ts" setup>  
  import {computed} from "vue";
  import { useRoute } from "vue-router";
  import NavDrawer from "./components/NavDrawer.vue";
  import { getAuth, onAuthStateChanged } from 'firebase/auth'
  import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
  import { getDatabase, ref, onDisconnect, set } from "firebase/database";
  import { db, firebaseApp } from "./composables/database";
import { on } from "events";

  const route = useRoute();
  const isLoginPage = computed((): boolean => {
    return route.path == '/login'
  });

  const auth = getAuth();
  let currentUserId: string | null = null;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User has signed in')
      currentUserId = user.uid;
      setDoc(doc(db, 'users', user.uid), {isOnline: true}, {merge: true});

      const database = getDatabase(firebaseApp);
      onDisconnect(ref(database, `users/${user.uid}`)).update({isOnline: false});
    } else {
      console.log('User has signed out')
      if(currentUserId){
        setDoc(doc(db, 'users', currentUserId), { isOnline: false }, { merge: true });
      }
      currentUserId = null;
    }
  });

</script>

<style>
</style>
