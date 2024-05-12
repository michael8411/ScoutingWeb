<template>
  <NavDrawer v-if="!isLoginPage" />
  <RouterView />

</template>

<script lang="ts" setup>  
  import {computed} from "vue";
  import { useRoute} from "vue-router";
  import NavDrawer from "./components/NavDrawer.vue";

  const route = useRoute();
  const isLoginPage = computed((): boolean => {
    return route.path == '/login'
  });

</script>

<style>
</style>