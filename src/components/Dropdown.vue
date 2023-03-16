<template>
    <div id="dropDownDiv">
        <!-- <label id="commentName"> {{ options.commentName }}</label> -->
        <select>
            <option value="Defualt" disabled selected>Select your option</option>
            <option v-for="choices in options.choices" :value="option">
                {{ choices }}
            </option>
        </select>
    </div>
</template>

<script setup >
import { ref } from 'vue'

const { JSON_FILE } = defineProps(['options'])

</script>


<style scoped>
#dropDownDiv {
    display: flex;
    width: fit-content;
    overflow: hidden;
    flex-direction: row;
    justify-content: space-evenly;
}

#commentName {
    margin: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
    vertical-align: text-bottom;
    width: fit-content;
    padding-right: 0.5em;
    padding-left: 0.5em;
}

select {

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
    background-image: url("../assets/select-arrow.png"),
        /*linear-gradient(var(--baseFg), var(--baseFg)),*/
        linear-gradient(-135deg, transparent 50%, var(--accentBg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentBg) 50%),
        linear-gradient(var(--accentBg) 42%, var(--accentFg) 42%);
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    background-size: 1px 100%, 20px 22px, 20px 22px, 20px 100%;
    background-position: right 20px center, right bottom, right bottom, right bottom;
}

select:hover {

    background-image: linear-gradient(var(--accentFg), var(--accentFg)),
        linear-gradient(-135deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(var(--accentFg) 42%, var(--accentBg) 42%);
}

select:active {

    background-image: linear-gradient(var(--accentFg), var(--accentFg)),
        linear-gradient(-135deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(var(--accentFg) 42%, var(--accentBg) 42%);
    color: var(--accentBg);
    border: none;
    background-color: var(--accentFg);
}
</style>
