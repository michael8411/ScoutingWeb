<template>
    <div class="main">
        <header class="top">
            <h1>Google Sheets</h1>
        </header>
        <iframe class="sheet" src="https://docs.google.com/spreadsheets/d/15giJVkuOy0v2wKyAy-2l3TfwOa-nRj0uLQra-LScbJo/edit#gid=0"
        width=100% height=100% frameborder="0" 
        style="filter: invert(100%) hue-rotate(180deg);"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.main{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.top{
    display: flex;
    justify-content: center;
}

.sheet{
    width: 95vw;
    height: 80%;
}
</style>