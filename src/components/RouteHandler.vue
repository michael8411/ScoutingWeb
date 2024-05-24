<script lang='ts' setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentPage = computed(() => route.path);
</script>

<template>
    <div id="app">
        <a v-if="currentPage == '/login' " href="/scouting"></a>
        <a v-if="currentPage == '/scouting' " href="/login"></a>
        <a v-if="currentPage == '/sheets' " href="/sheets"></a>
        <a v-if="currentPage == '/admin'" href="/admin"></a>
    </div>
</template>