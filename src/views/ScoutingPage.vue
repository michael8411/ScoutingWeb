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
    </main>

    <footer class="footer">
      <Button class="submit-button" @click="onClick" label="Submit to Database" />
    </footer>
  </div>
</template>

<script setup lang="ts">
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
  const popup = document.querySelector('.invalid-popup') as HTMLElement
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
    console.error('Error adding document:', e)
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
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Manrope', sans-serif;
}

@media screen and (min-width: 481px) {
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .scouting-container {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    position: static;
    display: flex;
    flex-direction: column;
    max-height: 80%;
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
  }

  .header,
  .footer {
    flex-shrink: 0;
  }
}

/* SCOUTING CONTAINER */
.scouting-container {
  width: clamp(300px, 60%, 1200px);
  padding: 1rem;
  background-color: #121212;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

/* HEADER */
.header {
  /* Width and new gradient background */
  width: 100%;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 12px;
  text-align: center;
  padding: 1.5rem;
  margin-bottom: 2rem;

  /* Subtle shadow & entrance animation */
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  animation: fadeInDown 0.6s ease;

  /* Retaining old 'flex-shrink: 0' for layout integrity */
  flex-shrink: 0;
}

.title {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: #f1f1f1;
  letter-spacing: 1px;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* DYNAMIC COMPONENTS */
.dynamic-components {
  width: 100%;
  flex: 1;
  background-color: #0d0d0d;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);
  gap: 2.5rem;
  padding: 1.5rem;
}

/* Custom scrollbar for .dynamic-components */
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

/* INVALID POPUP */
.invalid-popup {
  margin-top: 1rem;
  color: #ff4444;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  transition: visibility 0.3s ease, opacity 0.3s ease;
}
.hide {
  visibility: hidden;
  opacity: 0;
}

/* FOOTER */
.footer {
  width: 100%;
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

/* SUBMIT BUTTON */
.submit-button {
  width: 100%;
  max-width: 300px;
  height: 50px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  transition: background-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
}
.submit-button:hover {
  transform: translateY(-2px);
}
.submit-button:active {
  transform: translateY(0);
}

/* MEDIA QUERIES FOR SMALL DEVICES */
@media screen and (max-width: 480px) {
  .scouting-container {
    position: fixed;
    top: 64px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .header,
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 10;
  }

  .header {
    top: 64px;
    border-radius: 0;
    margin: 0;
  }

  .footer {
    bottom: 0;
    border-radius: 0;
    margin: 0;
  }

  .main-content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    width: 100%;
    margin-top: 64px;
    margin-bottom: 64px;
  }

  .dynamic-components {
    border-radius: 0;
    box-shadow: none;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }
}
</style>
