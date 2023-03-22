<template>
    <label>{{ labelId }}</label>
    <form>
        <input onkeypress="return event.keyCode != 13" :title="props.title" id="textField" :maxlength="props.maxlength"
            :filterFile="props.filterFile" v-model="inputText" />
        <label class="maxChar" :id="labelId">{{ inputText.length }}/{{ props.maxlength }}</label>
    </form>
</template>
  
<script setup>
import { ref, watch, onMounted } from "vue";
import { useFormStore } from '../state_management/formStore.ts';

const formStore = useFormStore();

const props = defineProps({
    class: { type: String, default: "", required: true },
    label: { type: String, required: true },
    filterFile: { type: Array, required: false },
    maxlength: { type: Number, default: 100, required: false },
    title: { type: String, default: "", required: false },
    constraints: { type: String, default: "", required: false },
    initialValue: { type: String, default: "", required: false }
});

const labelId = props.label;

const trimmedLabel = labelId.replace(":", "").trim();
const invalidMessage = `Invalid ${trimmedLabel}   `;
const validMessage = `Valid ${trimmedLabel}   `;


const inputText = ref(props.initialValue);
const submissionMap = formStore.submissionData;

onMounted(() => {
  formStore.setValue(trimmedLabel, props.initialValue);
});

let validationStatusMessage = "";

//make a watch for the submissionMap

function getValidationMessage(newValue) {
    return newValue.length === 0 ? "" : invalidMessage;
}

function handleKeyPress(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
    }
}

function handleConstraints(constraints, newValue) {
    switch (constraints) {
        case "Initials":
            if (!/^[a-zA-Z]*$/.test(newValue)) {
                inputText.value = newValue.slice(0, -1);
            }

            if (newValue.length === 0) {
                formStore.setValue(trimmedLabel, "");
                validationStatusMessage = "";
            } else if (newValue.length < 2) {
                formStore.setValue(trimmedLabel, "");
                validationStatusMessage = invalidMessage;
            } else {
                document.getElementById(labelId).style.color = "var(--color-text)";
                formStore.setValue(trimmedLabel, newValue);
                validationStatusMessage = validMessage;
            }
            break;
        case "Letters":
            inputText.value = newValue.replace(/[^a-zA-Z]/g, "");
            formStore.setValue(trimmedLabel, newValue);
            break;
        case "Text":
            inputText.value = newValue.replace(/[^a-zA-Z\s]/g, "");
            formStore.setValue(trimmedLabel, newValue);
            break;
        case "Numbers":
            inputText.value = newValue.replace(/\D/g, "");
            formStore.setValue(trimmedLabel, newValue);
            break;
    }
}
function handleMaxLength(newValue) {
    const maxLength = props.maxlength;

    if (newValue.length === maxLength) {
        inputText.value = newValue.toUpperCase();
        document.getElementById(labelId).style.color = "red";
    } else {
        document.getElementById(labelId).style.color = "var(--color-text)";
    }
}

function handleFilterFile(newValue) {
    const filterFile = props.filterFile;

    if (filterFile) {
        const isValueValid = filterFile.includes(newValue);

        if (isValueValid) {
            document.getElementById(labelId).style.color = "var(--color-text)";
            formStore.setValue(trimmedLabel, newValue);
            validationStatusMessage = validMessage;
        } else {
            formStore.setValue(trimmedLabel, "");
            validationStatusMessage = getValidationMessage(newValue);
        }
    }
}
watch(inputText, (newValue) => {
    handleConstraints(props.constraints, newValue);
    handleMaxLength(newValue);
    handleFilterFile(newValue);
});
</script>


<style scoped>
.maxChar {
    position: relative;
    left: 5px;
    font-size: 11px;
}

form {
    display: flex;
    flex-direction: column;
    align-content: space-between;
    justify-content: center;
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