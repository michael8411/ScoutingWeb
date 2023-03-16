<template>
    <label>{{ props.label }}</label>
    <form>
        <input onkeypress="return event.keyCode != 13" :title="props.title" id="textField" :maxlength="props.maxlength"
            :filterFile="props.filterFile" v-model="inputText" />
        <label class="maxChar" :id="props.label"><span
                :style="{ color: validationStatusMessage === validMessage ? 'green' : 'red' }">{{
                    validationStatusMessage
                }}</span>{{ inputText.length }}/{{ props.maxlength }}</label>
    </form>
</template>
  
<script setup>
import { ref, watch, defineProps, inject, defineComponent } from "vue";



const props = defineProps({
    label: { type: String, required: true },
    filterFile: { type: String },
    maxlength: { type: Number, default: 100 },
    title: { type: String, default: "" },
    constraints: { type: String, default: "" }
});

const invalidMessage = `Invalid ${props.label.replace(":", "").trim()}`;
const validMessage = `Valid ${props.label.replace(":", "").trim()}`;

const inputText = ref("");

const submissionMap = inject("submissionMap");
submissionMap.value.set(props.label.replace(":", "").trim(), "");


let validationStatusMessage = "";

function getValidationMessage(newValue) {
    return newValue.length === 0 ? "" : invalidMessage;
}



function handleMaxLength(newValue) {
    const maxLength = props.maxlength;
    const labelId = props.label;

    if (newValue.length === maxLength) {
        inputText.value = newValue.toUpperCase();
        document.getElementById(labelId).style.color = "red";
    } else {
        document.getElementById(labelId).style.color = "var(--color-text)";
    }
}

function handleFilterFile(newValue) {
    const filterFile = props.filterFile;
    const textFieldName = props.label.replace(":", "").trim();

    if (filterFile) {
        let invalidInput = true;

        for (let i = 0; i < filterFile.length; i++) {
            if (filterFile[i] === newValue) {
                invalidInput = false;
                document.getElementById(props.label).style.color = "var(--color-text)";
                submissionMap.value.set(textFieldName, newValue);
                validationStatusMessage = validMessage;
            }
        }
        if (invalidInput) {
            submissionMap.value.set(textFieldName, "");
            validationStatusMessage = getValidationMessage(newValue)
        }
    }
}

function isNumber(char) {
    return /\d/.test(char);
}

function isLetter(char) {
    return /[a-zA-Z]/.test(char);
}

function handleInputWithConstraints(newValue) {
    if (props.constraints === "Initials") {
        const textFieldName = props.label.replace(":", "").trim();
        if (!isLetter(newValue.slice(-1))) {
            inputText.value = newValue.slice(0, -1);
        }
        if (newValue.length === 2) {
            submissionMap.value.set(textFieldName, newValue);
            validationStatusMessage = validMessage;
        } else {
            submissionMap.value.set(textFieldName, "");
            validationStatusMessage = getValidationMessage(newValue)
        }
    }

    if (props.constraints === "Letters") {
        if (!isLetter(newValue.slice(-1))) {
            validationStatusMessage = getValidationMessage(newValue)
            inputText.value = newValue.slice(0, -1);
        }
    }

    if (props.constraints === "Numbers") {
        if (!isNumber(newValue.slice(-1))) {
            validationStatusMessage = getValidationMessage(newValue)
            inputText.value = newValue.slice(0, -1);
        }
    }

}

watch(inputText, (newValue) => {
    handleMaxLength(newValue);
    handleFilterFile(newValue);
    handleInputWithConstraints(newValue);
});

</script>
  
<style scoped>
.maxChar {
    position: relative;
    font-size: 11px;
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