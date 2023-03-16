<template>
    <label>{{ props.label }}</label>
    <form>
        <input onkeypress="return event.keyCode != 13" :pattern="props.pattern" :title="props.title" id="textField"
            :maxlength="props.maxlength" :filterFile="props.filterFile" v-model="text" />
        <label class="maxChar" :id="props.label"><span :style="{ color: warning === validMessage ? 'green' : 'red' }">{{
            warning
        }}</span>{{ text.length }}/{{ props.maxlength }}</label>
    </form>
</template>

<script setup>
import { ref, watch, defineProps } from "vue";
const invalidMessage = "Invalid " + props.label.replace(":", "")
const validMessage = "Valid " + props.label.replace(":", "")

const text = ref("");
let warning = "";

const props = defineProps({
    label: { type: String, required: true },
    filterFile: { type: String },
    maxlength: { type: Number, default: 100 },
    pattern: { type: String, default: "" },
    title: { type: String, default: "" },
});

function isNumber(char) {
    return /\d/.test(char);
}

function isLetter(char) {
    return /[a-zA-Z]/.test(char);
}

watch(text, (newValue) => {
    const maxLength = props.maxlength;
    const labelId = props.label;
    const filterFile = props.filterFile;

    if (newValue.length === maxLength) {
        text.value = newValue.toUpperCase();
        document.getElementById(labelId).style.color = "red";
    } else {
        document.getElementById(labelId).style.color = "var(--color-text)";
    }

    if (filterFile) {
        let invalidInput = true;

        for (let i = 0; i < filterFile.length; i++) {
            if (filterFile[i] === newValue) {
                invalidInput = false;
                document.getElementById(labelId).style.color = "var(--color-text)";
                warning = validMessage;
                break;
            }
        }

        if (invalidInput) {
            warning = newValue.length === 0 ? "" : invalidMessage;
        }
    }
    if (props.label === "Scout's Initials:")
    {
        if ((isLetter(newValue.slice(-1)))) {    
        }else
        {
            warning = newValue.length === 0 ? "" : invalidMessage;
            text.value = newValue.slice(0, -1); 
        }
    }
    if (props.label === "Team Number: ")
    {
        if ((isNumber(newValue.slice(-1)))) {    
        }else
        {
            warning = newValue.length === 0 ? "" : invalidMessage;
            text.value = newValue.slice(0, -1); 
        }
    }
        
});
</script>

<style scoped>
.maxChar {
    position: absolute;
    font-size: 11px;
    top: 20px;
    left: 130px;
}

#textField {
    position: relative;
    border: none;
    background-color: var(--color-background);
    color: var(--baseFg);
    border-bottom: 1px solid var(--color-text);
    left: 5px;
}
</style>