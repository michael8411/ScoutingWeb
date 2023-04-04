<template>
  <div style="height: 100%; padding: 2%;">
    <header id="top">
      <div id="logo-logout">
        <img id="logo" src="../assets/images/cryptonite_logo.png">
        <button id="logout" @click="logoutOnClick()">
          <img id="logout-image" src="../assets/images/logout.png">
          <p id="logout-text">Logout</p>
        </button>
      </div>
      <h1 id="title">Comment Scouting</h1>
    </header>

    <main id="comments">
      <div class="textboxes">
        <TextField v-for="(field, index) in textFields" :key="index" v-bind="field" :reset="resetVal" />
      </div>

      <section id="options">
        <div id="optionLabels">
          <label class="optionLabel" v-for="(option, index) in optionList" :key="index">
            {{ option.optionLabel }}
          </label>
        </div>
        <div id="dropdowns">
          <Dropdown v-for="(option, index) in optionList" :key="index" :value="option.optionLabel" :options="option"
            @change="onChange($event, option.optionLabel)" :reset="resetVal" />
        </div>
      </section>

      <div class="textboxes">
        <TextField v-bind="additionalCommentsField" :reset="resetVal" />
      </div>
      <Button @click="onClick()" label="Submit to Database"></Button>
      <h2 class="hide" id="invalid-popup">INVALID INFORMATION</h2>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { collection, addDoc, doc, setDoc, Timestamp} from "firebase/firestore";
import optionsJSON from '../data/options.json';
import teamsJSON from '../data/teams.json';
import TextField from '../components/TextField.vue';
import Dropdown from '../components/Dropdown.vue';
import Button from '../components/Button.vue';
import { useFormStore } from '../state_management/formStore.ts';
import database from '../main.ts';
import router from '../router/index.ts'
const formStore = useFormStore();
const resetVal = ref(false);
const optionList = ref(optionsJSON);
const textFields = [
  {
    class: 'scouts-initials-textfield',
    constraints: 'Initials',
    label: "Scout's Initials:",
    resetBehavior: 'preserve',
    maxlength: 2,
  },
  {
    class: 'team-number-textfield',
    constraints: 'Numbers',
    filterFile: teamsJSON.teams,
    label: 'Team Number: ',
    maxlength: 5,
  },
  {
    class: 'match-number-textfield',
    constraints: 'Numbers',
    label: 'Match Number:',
    maxlength: 2,
    initialValue: '1',
    resetBehavior: 'increment',
  },
];
const additionalCommentsField = {
  class: 'additional-comments-textfield',
  constraints: 'Text',
  label: 'Additional Comments:',
  maxlength: 200,
};

onMounted(() => {
  optionList.value.forEach(option => {
    formStore.setValue(option.optionLabel, '');
  });
});
function onChange(event, key) {
  formStore.setValue(key, event.target.value);
  printSubmissionData();
}
function toggleReset() {
  resetVal.value = true;
}
function onClick() {
  for (const [key, value] of formStore.submissionData.entries()) {
    var popup = document.getElementById("invalid-popup");
    if (value === "" && key != "Additional Comments") {
      popup.innerHTML = key + " is Invalid";
      popup.classList.remove("hide");
      break;
    }
    else {
      popup.classList.add("hide");
    }
  }
  if (popup.className === "hide") {
    addMatchToDatabase();
    toggleReset();
  }
}
async function addMatchToDatabase() {
  try {
    let submitMap = {};
    formStore.submissionData.forEach((value, key) => {
      submitMap[key] = value
    });

    const matchNumString = "match" + formStore.submissionData.get('Match Number');
    const newMatch = collection(database, "matches", matchNumString, formStore.submissionData.get('Team Number'));
    await addDoc(newMatch, submitMap);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function logoutOnClick(){
  router.push('/login')
}

watch(resetVal, (newValue, oldValue) => {
  setTimeout(() => {
    if (newValue === true) {
      optionList.value.forEach(option => {
        formStore.setValue(option.optionLabel, '');
      });
      resetVal.value = false;
    }
  }, 1500);
});
function printSubmissionData() {
  console.log("----- Submission Data -----");
  formStore.submissionData.forEach((value, key) => {
    console.log(key + ' = ' + value);
  });
  console.log("--------------------");
}
</script>

  
<style>
:root {
  --option-grid-gap: 20px;
}

#logo {
  max-width: 20%;
  height: 20%;
  margin-right: auto;
}


#top {
  width: auto;
  display: flex;
  flex-direction: column;
}

#comments {
  display: grid;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 30px;
  width: 50%;
  min-width: fit-content;
}

#title {
  font-family: 'Lemon/Milk', 'Futura PT';
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  width: auto;
  height: auto;
  top: 0;
  font-size: calc(100% + 1.8vw);
}

#logo-logout{
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#logout{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: center;
  background-color: transparent;
  padding: 0;
  margin-top: auto;
  margin: 0;
  border: none;
  max-width: 20%;
  height: 100%;
}

#logout-text{
  max-width: 100%;
  font-size: 2vw;
  filter: invert(1) sepia(100%) saturate(10000%) hue-rotate(45deg);
  font-weight: bold;
  font-family: 'Lemon/Milk';
}

#logout-image{
  max-width: 25%;
  height: 20%;
  pointer-events: none;
  filter: invert(1) sepia(100%) saturate(10000%) hue-rotate(45deg);
  margin-top: auto;
  margin-bottom: auto;
}

#options {
  display: flex;
  flex-direction: row;
  align-items: middle;
  justify-content: center;
}

#optionLabels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: calc(var(--option-grid-gap) + 13px);
}

#dropdowns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--option-grid-gap);
  width: fit-content;
}

.textboxes {
  display: grid;
  gap: 20px;
}

.optionLabel {
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  vertical-align: middle;
  width: fit-content;
  padding-right: 0.5em;
  padding-left: 0.5em;
}

#invalid-popup {
  margin: auto;
  color: red;
}

.hide {
  visibility: hidden;
}
</style>
  
  