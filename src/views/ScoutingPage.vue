<!-- ScoutingPage.vue -->
<!-- ScoutingPage.vue -->
<template>
  <div class="scouting-container">
    <header class="header">
      <h1 class="title">Comment Scouting</h1>
    </header>
    <main class="main-content">
      <div class="dynamic-components">
        <component 
          v-for="component in componentStore.components"
          :key="component.id"
          :is="getComponentType(component.type)"
          :componentId="component.id"
        />
      </div>

      <h2 class="invalid-popup hide">INVALID INFORMATION</h2>
    </main>
    <Button class="submit-button" @click="onClick" label="Submit to Database" />
  </div>
</template>

<script setup lang="ts">
// import router from '../router/index'
// import teamsJSON from '../data/teams.json';
// import NavDrawer from '../components/NavDrawer.vue';
// import TextField from '../components/TextField.vue';
// import Dropdown from '../components/DropdownField.vue';

import { ref, onMounted, watch } from 'vue'
import { doc, setDoc } from 'firebase/firestore'
import Button from '../components/StyledButton.vue'
import { useFormStore } from '../state_management/formStore'
import { db } from '../composables/database'
import { useComponentStore } from '../state_management/componentStore'
import DynamicDropdown from '../components/DropdownField.vue'
import DynamicTextField from '../components/TextField.vue'

const formStore = useFormStore()
const resetVal = ref(false)

const componentStore = useComponentStore()

onMounted(() => {
  componentStore.syncComponents()
})

function getComponentType(type: string) {
  switch (type) {
    case 'DynamicDropdown':
      return DynamicDropdown
    case 'DynamicTextField':
      return DynamicTextField
    default:
      return null
  }
}
function onClick() {
  if (formStore.validate()) {
    addMatchToDatabase()
    resetVal.value = true
  } else {
    showInvalidPopup()
  }
}

function showInvalidPopup() {
  let popup = document.querySelector('.invalid-popup') as HTMLElement
  if (popup) {
    popup.classList.remove('hide')
    setTimeout(() => popup.classList.add('hide'), 3000)
  }
}

async function addMatchToDatabase() {
  try {
    const submitMap = Object.fromEntries(formStore.submissionData)
    const matchNumString = `match${formStore.submissionData.get('Match Number')}`
    const newMatch = doc(
      db,
      'matches',
      matchNumString,
      'teams',
      formStore.submissionData.get('Team Number')
    )
    await setDoc(newMatch, submitMap)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

watch(resetVal, (newValue) => {
  if (newValue) {
    formStore.reset()
    resetVal.value = false
  }
})
</script>

<style scoped>
.title {
  font-size: 48px;
  font-family: 'Manrope', sans-serif;
  margin: 0;
  padding: 0;
  text-align: center;
  color: 989898;
}
.dynamic-components {
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  min-width: fit-content;
  width: 600px;
  height: 950px;
  background-color: #0d0d0d;
  border-radius: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #6b6b6b transparent;
}
.dynamic-components::-webkit-scrollbar {
  width: 8px; /* Adjust the width of the scrollbar */
}

.dynamic-components::-webkit-scrollbar-track {
  background: transparent; /* Makes the track invisible */
}

.dynamic-components::-webkit-scrollbar-thumb {
  background-color: #6b6b6b; /* Color of the thumb */
  border-radius: 10px; /* Rounded corners for the thumb */
  border: 2px solid transparent; /* Optional: Adds a border around the thumb */
  background-clip: padding-box; /* Ensures the border doesn't overlap the background color */
  min-height: 30px; /* Sets a minimum height for the thumb */
}
.dynamic-components::-webkit-scrollbar-thumb {
  right: 2px; /* Shifts the scrollbar thumb slightly to the left */
}
.dropdown {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.main-content {
  display: flex;
  flex-direction: column;
  height: 80%;
  width: 50%;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.scouting-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 80px;
}

.submit-button {
  width: 350px;
  height: 75px;
}

.submit-button::after {
  width: 350px;
  height: 75px;
}

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
  font-family: 'Manrope', sans-serif;
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

@media screen and (max-width: 600px) {
  .title {
    font-size: 32px;
  }

  .dynamic-components {
    position: relative;
    padding: 20px;
    width: 100%;
    height: 100%;
    border-radius: 0;
    overflow-y: auto;
  }

  .main-content {
    width: 100%;
    height: 100%;
    margin-top: 0;
  }

  .scouting-container {
    padding: 0;
    height: 100vh;
    width: 100vw;
  }

  .submit-button,
  .submit-button::after {
    width: 100%;
    height: 60px;
  }

  .logo {
    max-width: 40%;
    height: auto;
  }

  #comments {
    width: 100%;
  }

  #title {
    font-size: calc(100% + 1.2vw);
  }

  .logout-text {
    font-size: 4vw;
  }

  .logout-image {
    max-width: 40%;
    height: auto;
  }

  #optionLabels {
    gap: calc(var(--option-grid-gap) + 8px);
  }
}
</style>
