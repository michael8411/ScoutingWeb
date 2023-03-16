<template>
    <label>{{ props.label }}</label>
    <form>
        <input onkeypress="return event.keyCode != 13" :title="props.title" id="textField" :maxlength="props.maxlength"
            :filterFile="props.filterFile" v-model="text" />
        <label class="maxChar" :id="props.label"><span :style="{ color: warning === validMessage ? 'green' : 'red' }">{{
            warning
        }}</span>{{ text.length }}/{{ props.maxlength }}</label>
    </form>
</template>
  
<script setup>
import { ref, watch, defineProps, inject, defineComponent } from "vue";

const text = ref("");
let warning = "";

const props = defineProps({
    label: { type: String, required: true },
    filterFile: { type: String },
    maxlength: { type: Number, default: 100 },
    title: { type: String, default: "" },
    constraints: { type: String, default: "" }
});

const invalidMessage = `Invalid ${props.label.replace(":", "")}`;
const validMessage = `Valid ${props.label.replace(":", "")}`;
const submissionMap = inject("submissionMap");

function isNumber(char) {
    return /\d/.test(char);
}

function isLetter(char) {
    return /[a-zA-Z]/.test(char);
}

function handleMaxLength(newValue) {
    const maxLength = props.maxlength;
    const labelId = props.label;

    if (newValue.length === maxLength) {
        text.value = newValue.toUpperCase();
        document.getElementById(labelId).style.color = "red";
    } else {
        document.getElementById(labelId).style.color = "var(--color-text)";
    }
}

function handleFilterFile(newValue) {
    const filterFile = props.filterFile;
    const textFieldName = props.label.replace(": ", "");

    if (filterFile) {
        let invalidInput = true;

        for (let i = 0; i < filterFile.length; i++) {
            if (filterFile[i] === newValue) {
                invalidInput = false;
                document.getElementById(props.label).style.color = "var(--color-text)";
                submissionMap.value.set(textFieldName, newValue);
                warning = validMessage;
                break;
            }
        }

        if (invalidInput) {
            submissionMap.value.set(textFieldName, "");
            warning = newValue.length === 0 ? "" : invalidMessage;
        }
    }
}

function handleInputWithConstraints(newValue) {
    if (props.constraints === "Initials") {
        const textFieldName = props.label.replace(": ", "");

        if (newValue.length === 2 && isLetter(newValue.slice(-1))) {
            submissionMap.value.set(textFieldName, newValue);
            warning = validMessage;
        } else {
            submissionMap.value.set(textFieldName, "");
            warning = newValue.length === 0 ? "" : invalidMessage;
        }
    }

    if (props.constraints === "Letters") {
        if (!isLetter(newValue.slice(-1))) {
            warning = newValue.length === 0 ? "" : invalidMessage;
            text.value = newValue.slice(0, -1);
        }
    }

    if (props.constraints === "Numbers") {
        if (!isNumber(newValue.slice(-1))) {
            warning = newValue.length === 0 ? "" : invalidMessage;
            text.value = newValue.slice(0, -1);
        }
    }

}

watch(text, (newValue) => {
    handleMaxLength(newValue);
    handleFilterFile(newValue);
    handleInputWithConstraints(newValue);
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