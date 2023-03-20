<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentPage = computed(() => route.path);
</script>

<template>
    <div id="app">
        <a v-if = "currentPage == '/login' " href="/scouting">scouting</a>
        <a v-if = "currentPage == '/scouting' " href="/login">login</a>

    </div>
</template>