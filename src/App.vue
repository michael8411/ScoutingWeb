<template>
  <NavDrawer v-if="!isLoginPage" />
  <RouterView />

</template>

<script lang="ts" setup>  
  import {computed} from "vue";
  import { useRoute } from "vue-router";
  import NavDrawer from "./components/NavDrawer.vue";
  import { getAuth, onAuthStateChanged } from 'firebase/auth'
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "./composables/database";

  const route = useRoute();
  const isLoginPage = computed((): boolean => {
    return route.path == '/login'
  });


  // TODO: Restrict online changes to admin users
  const auth = getAuth();
  let currentUserId: string | null = null;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUserId = user.uid;
      setDoc(doc(db, 'users', user.uid), {isOnline: true}, {merge: true});
      
    } else {
      if(currentUserId){
        setDoc(doc(db, 'users', currentUserId), { isOnline: false }, { merge: true });
      }
      currentUserId = null;
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && currentUserId) {
      setDoc(doc(db, 'users', currentUserId), { isOnline: false }, { merge: true });
    } else if (document.visibilityState === 'visible' && currentUserId) {
      setDoc(doc(db, 'users', currentUserId), { isOnline: true }, { merge: true });
    }
  });

</script>

<style>
</style>
