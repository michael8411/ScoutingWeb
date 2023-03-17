<template>
    <div class="dropdown-container">
        <select class="custom-dropdown">
            <option value="Default" disabled selected>Select your option</option>
            <option v-for="choice in options.choices" :value="choice">
                {{ choice }}
            </option>
        </select>
    </div>
</template>
  
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    options: Object,
});

</script>
  
<style scoped>
.dropdown-container {
    display: flex;
    width: fit-content;
    overflow: hidden;
    flex-direction: row;
    justify-content: space-evenly;
}

.custom-dropdown {
    float: left;
    align-content: flex-end;
    font: 400 12px/1.3;
    -webkit-appearance: none;
    appearance: none;
    color: var(--baseFg);
    border: none;
    line-height: 1;
    outline: 0;
    width: 150px;
    height: 33px;
    margin: 2px;
    box-sizing: border-box;
    padding: 0.65em 2.5em 0.55em 0.75em;
    border-radius: 5px;
    background-color: var(--vt-c-black-soft);
    background-image: url("../assets/images/select-arrow.png"),
        linear-gradient(-135deg, transparent 50%, var(--accentBg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentBg) 50%),
        linear-gradient(var(--accentBg) 42%, var(--accentFg) 42%);
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    background-size: 1px 100%, 20px 22px, 20px 22px, 20px 100%;
    background-position: right 20px center, right bottom, right bottom, right bottom;
}

.custom-dropdown:hover {
    background-image: linear-gradient(var(--accentFg), var(--accentFg)),
        linear-gradient(-135deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(var(--accentFg) 42%, var(--accentBg) 42%);
}

.custom-dropdown:active {
    background-image: linear-gradient(var(--accentFg), var(--accentFg)),
        linear-gradient(-135deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(var(--accentFg) 42%, var(--accentBg) 42%);
    color: var(--accentBg);
    border: none;
    background-color: var(--accentFg);
}
</style>