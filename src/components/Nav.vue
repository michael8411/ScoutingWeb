<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentPage = computed(() => route.path);
console.log(currentPage.value)
</script>

<template>
    <div id="app">
        <a v-if = "currentPage == '/Login' " href="/Scouting">Scouting</a>
        <a v-if = "currentPage == '/Scouting' " href="/Login">Login</a>

    </div>
</template>