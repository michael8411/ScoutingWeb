<template>
  <NavDrawer/>
  <div class="scouting-container">
    <header class="header">
      <div class="logo-logout">
        <img class="logo" src="../assets/images/cryptonite_logo.png" alt="Logo">
        <button class="logout-button" @click="logoutOnClick">
          <img class="logout-image" src="../assets/images/logout.png" alt="Logout">
          <span class="logout-text">Logout</span>
        </button>
      </div>
      <h1 class="title">Comment Scouting</h1>
    </header>

    <main class="main-content">
      <div class="dynamic-components">
        <div v-for="(componentConfig, index) in components" :key="index">
          <component :is="componentConfig.type" v-bind="componentConfig.props" />
        </div>
      </div>
      <Button @click="onClick" label="Submit to Database" />
      <h2 class="invalid-popup hide">INVALID INFORMATION</h2>
    </main>
    <iframe src="https://docs.google.com/spreadsheets/d/15giJVkuOy0v2wKyAy-2l3TfwOa-nRj0uLQra-LScbJo/edit#gid=0"
      width=400 height=400 frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { doc, setDoc } from "firebase/firestore";
import TextField from '../components/TextField.vue';
import Dropdown from '../components/DropdownField.vue';
import Button from '../components/StyledButton.vue';
import { useFormStore } from '../state_management/formStore';
import database from '../main';
import router from '../router/index';
import teamsJSON from '../data/teams.json';
import NavDrawer from '../components/NavDrawer.vue';

interface ComponentConfig {
  type: typeof TextField | typeof Dropdown;
  props: Record<string, any>;
}

const formStore = useFormStore();
const resetVal = ref(false);

const components = ref<ComponentConfig[]>([

  {
    type: Dropdown,
    props: {
      modelValue: '',
      options: teamsJSON.teams
    }
  }
]);

onMounted(() => {
  formStore.reset();
});

function onClick() {
  if (formStore.validate()) {
    addMatchToDatabase();
    resetVal.value = true;
  } else {
    showInvalidPopup();
  }
}

function showInvalidPopup() {
  let popup = document.querySelector(".invalid-popup") as HTMLElement;
  if (popup) {
    popup.classList.remove("hide");
    setTimeout(() => popup.classList.add("hide"), 3000);
  }
}

async function addMatchToDatabase() {
  try {
    const submitMap = Object.fromEntries(formStore.submissionData);
    const matchNumString = `match${formStore.submissionData.get('Match Number')}`;
    const newMatch = doc(database, "matches", matchNumString, "teams", formStore.submissionData.get('Team Number'));
    await setDoc(newMatch, submitMap);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function logoutOnClick() {
  router.push('/login');
}

watch(resetVal, (newValue) => {
  if (newValue) {
    formStore.reset();
    resetVal.value = false;
  }
});
</script>

  
<style scoped>
:root {
  --option-grid-gap: 20px;
}

.logo {
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

.logo-logout {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.logout {
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

.logout-text {
  max-width: 100%;
  font-size: 2vw;
  filter: invert(1) sepia(100%) saturate(10000%) hue-rotate(45deg);
  font-weight: bold;
  font-family: 'Lemon/Milk';
}

.logout-image {
  max-width: 25%;
  height: 20%;
  pointer-events: none;
  filter: invert(1) sepia(100%) saturate(10000%) hue-rotate(45deg);
  margin-top: auto;
  margin-bottom: auto;
}

.logout-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
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
  display: flex;
  flex-direction: column;
  gap: var(--option-grid-gap);
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
  
  