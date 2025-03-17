<template>
  <NavDrawer v-if="isProtected" />
  <RouterView />

</template>

<script lang="ts" setup>  
  import {computed} from "vue";
  import { useRoute} from "vue-router";
  import NavDrawer from "./components/NavDrawer.vue";

  const route = useRoute();
  const isProtected = computed((): boolean => {
    return route.path != '/login' && route.path != '/reset'
  });

</script>

<style>
</style>