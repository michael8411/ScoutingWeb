<template>
  <NavDrawer v-if="isProtected" />
  <RouterView />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavDrawer from './components/NavDrawer.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getDatabase, ref, onDisconnect, set } from 'firebase/database'
import { db } from './composables/database'

const route = useRoute()
const isProtected = computed((): boolean => {
  return route.path != '/login'
})

const auth = getAuth()
let currentUserId: string | null = null
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User has signed in')
    currentUserId = user.uid
    setDoc(doc(db, 'users', user.uid), { isOnline: true }, { merge: true })
  } else {
    console.log('User has signed out')
    if (currentUserId) {
      setDoc(doc(db, 'users', currentUserId), { isOnline: false }, { merge: true })
    }
    currentUserId = null
  }
})
</script>

<style></style>
