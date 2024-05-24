<template>
<component :is="icon"/>
</template>

<script setup lang="ts">
import {defineAsyncComponent, defineProps} from 'vue';
const props = defineProps({
    name: {
        type: String,
        required: true
    },
});

const icon = defineAsyncComponent(() => import(`../assets/svgs/${props.name}.svg`));
</script>

<style scoped>
.svg-container svg {
    fill: currentColor;
}
</style>