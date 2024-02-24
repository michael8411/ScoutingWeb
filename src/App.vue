<template>
  <Nav />
  <RouterView />

</template>

<script lang="ts" setup>
  import { RouterView } from "vue-router";
  import Nav from "./components/RouteHandler.vue";

</script>

<style>
</style>
