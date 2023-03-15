

<template>
    <!-- THIS WHOLE FILE GOT REWRITEN -->

    <label>{{ props.label }}</label>
    <form>
        <input onkeypress="return event.keyCode != 13" :pattern="props.pattern" :title="props.title" id="textField"
            :maxlength="props.maxlength" :filterFile="props.filterFile" v-model="text" />
        <label class="maxChar" :id="props.label"><span :style="{ color: warning === validMessage ? 'green' : 'red' }">{{
            warning
        }}</span>{{
    text.length }}/{{ props.maxlength }}
        </label>
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
    title: { type: String, default: "Invalid Input" },
});



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
        let invalidNumber = true;

        for (let i = 0; i < filterFile.length; i++) {
            if (filterFile[i] === newValue) {
                invalidNumber = false;
                document.getElementById(labelId).style.color = "var(--color-text)";
                warning = validMessage;
                console.log(warning)
                break;
            }
        }

        if (invalidNumber) {
            warning = newValue.length === 0 ? "" : invalidMessage;
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