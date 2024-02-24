<template>
    <div :class="classProp">
        <label>{{ label }}</label>
        <form @submit.prevent>
            <input :title="title" :maxlength="maxlength" v-model="inputText" @input="handleInput"
                @keypress="handleKeypress" />
            <label class="maxChar">
                {{ inputText.length }}/{{ maxlength }}
            </label>
        </form>
        <p>{{ validationStatusMessage }}</p>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watch, onMounted, defineProps } from "vue";
import { useFormStore } from "../state_management/formStore";

type TextFieldProps = {
    class: string;
    label: string;
    filterFile?: string[];
    maxlength?: number;
    title?: string;
    constraints?: string;
    initialValue?: string;
    reset?: boolean;
    resetBehavior?: string;
};

const classProp = defineProps<TextFieldProps>().class;
const label = defineProps<TextFieldProps>().label;
const filterFile = defineProps<TextFieldProps>().filterFile;
const maxlength = defineProps<TextFieldProps>().maxlength || 100;
const title = defineProps<TextFieldProps>().title;
const constraints = defineProps<TextFieldProps>().constraints;
const initialValue = defineProps<TextFieldProps>().initialValue || "";
const reset = defineProps<TextFieldProps>().reset;
const resetBehavior = defineProps<TextFieldProps>().resetBehavior;

const formStore = useFormStore();
const inputText = ref(initialValue);
const validationStatusMessage = ref("");

onMounted(() => {
    formStore.setValue(label.replace(":", "").trim(), initialValue);
});

watch(() => reset, (newVal) => {
    if (newVal) resetField();
});

watch(inputText, (newValue) => {
    handleConstraints(newValue);
    handleMaxLength(newValue);
    handleFilterFile(newValue);
    updateFormStore(newValue);
});

function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    applyConstraints(target.value);
}

function handleKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') event.preventDefault();
}

function handleConstraints(newValue: string) {
    switch (constraints) {
        case "Initials":
            inputText.value = validateInitials(newValue);
            break;
        case "Letters":
            inputText.value = newValue.replace(/[^a-zA-Z]/g, "");
            break;
        case "Text":
            inputText.value = newValue.replace(/[^a-zA-Z0-9\s,.;()'"/?!]/g, "");
            break;
        case "Numbers":
            inputText.value = newValue.replace(/\D/g, "");
            break;
        default:
            inputText.value = newValue;
    }
}


function resetField() {
    switch (resetBehavior) {
        case "preserve":
            break;
        case "increment":
            inputText.value = (parseInt(inputText.value) + 1).toString();
            break;
        default:
            inputText.value = "";
    }
    updateFormStore(inputText.value);
}

function applyConstraints(newValue: string) {
    switch (constraints) {
        case "Initials":
            inputText.value = validateInitials(newValue);
            break;
        case "Letters":
            inputText.value = newValue.replace(/[^a-zA-Z]/g, "");
            break;
        case "Text":
            inputText.value = newValue.replace(/[^a-zA-Z0-9\s,.;()'"/?!]/g, "");
            break;
        case "Numbers":
            inputText.value = newValue.replace(/\D/g, "");
            break;
        default:
            inputText.value = newValue;
    }
}

function handleMaxLength(newValue: string) {
    if (newValue.length === maxlength) {
        inputText.value = newValue.toUpperCase();
        const lengthLabel = document.getElementById(label.replace(":", "").trim()) as HTMLLabelElement;
        if (lengthLabel) {
            lengthLabel.style.color = "red";
        }
    } else {
        const lengthLabel = document.getElementById(label.replace(":", "").trim()) as HTMLLabelElement;
        if (lengthLabel) {
            lengthLabel.style.color = "var(--color-text)";
        }
    }
}

function handleFilterFile(newValue: string) {
    if (filterFile && !filterFile.includes(newValue)) {
        validationStatusMessage.value = `Invalid ${label}`;
    } else {
        validationStatusMessage.value = `Valid ${label}`;
    }
}

function validateInitials(newValue: string) {
    return /^[a-zA-Z]*$/.test(newValue) ? newValue : newValue.slice(0, -1);
}

function updateFormStore(value: string) {
    formStore.setValue(label.replace(":", "").trim(), value);
}
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

input {
    position: relative;
    border: none;
    background-color: var(--color-background);
    color: var(--baseFg);
    border-bottom: 1px solid var(--color-text);
    left: 5px;
}
</style>