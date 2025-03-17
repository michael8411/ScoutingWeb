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
  font-size: clamp(25px, 4vw, 48px);
  font-family: 'Manrope', sans-serif;
  margin: 0;
  padding: 0;
  text-align: center;
  color: #989898;
}

.dynamic-components {
  padding: clamp(20px, 4vw, 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(10px, 2vw, 20px);
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
  height: calc(100vh - 200px);
  background-color: #0d0d0d;
  border-radius: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #6b6b6b transparent;
}

.dynamic-components::-webkit-scrollbar {
  width: 8px;
}

.dynamic-components::-webkit-scrollbar-track {
  background: transparent;
}

.dynamic-components::-webkit-scrollbar-thumb {
  background-color: #6b6b6b;
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
  min-height: 30px;
}

.dynamic-components::-webkit-scrollbar-thumb {
  right: 2px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: clamp(10px, 2vw, 20px);
  width: 100%;
  max-width: 800px;
}

.scouting-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(20px, 4vw, 80px);
  width: 100%;
  min-height: 100vh;
}

.submit-button,
.submit-button::after {
  width: 100%;
  max-width: 350px;
  height: 75px;
}

.invalid-popup {
  margin: auto;
  color: red;
}

.hide {
  visibility: hidden;
}

@media screen and (max-width: 600px) {
  .dynamic-components {
    height: calc(100vh - 150px);
    border-radius: 0;
  }

  .scouting-container {
    padding: 0;
    min-height: 100vh;
  }

  .submit-button,
  .submit-button::after {
    height: 60px;
  }
}
</style>

