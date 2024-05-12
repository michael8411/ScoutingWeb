<template>
    <div class="admin-page">
      <h1>Admin Page</h1>
      <div class="component-buttons">
        <button @click="addTextField('Team Number', 'Numbers', 4)">Add Team Number</button>
        <button @click="addTextField('Match Number', 'Numbers', 3)">Add Match Number</button>
        <button @click="addTextField('Scout Name', 'Letters', 3)">Add Scout Name</button>
        <button @click="addTextField('Comments', 'Text', 100)">Add Comments</button>
        <button @click="addDropdown('Alliance', ['Red', 'Blue'])">Add Alliance Dropdown</button>
        <button @click="addDropdown('Auto Start Position', ['None', 'Substation', 'Cable', 'Engage', 'Mobility', 'Dock'])">
          Add Auto Start Position Dropdown
        </button>
      </div>
      <div class="component-list">
        <component
          v-for="component in componentStore.components"
          :key="component.id"
          :is="getComponentType(component.type)"
          :componentId="component.id"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'
  import { useComponentStore } from '../state_management/componentStore'
  import { componentManager } from '../composables/componentManager'
  import DynamicTextField from '../components/TextField.vue'
  import DynamicDropdown from '../components/DropdownField.vue'
  
  const componentStore = useComponentStore()
  
  onMounted(() => {
    componentStore.syncComponents()
  })
  
  function getComponentType(type: string) {
    switch (type) {
      case 'DynamicTextField':
        return DynamicTextField
      case 'DynamicDropdown':
        return DynamicDropdown
      default:
        return null
    }
  }
  
  function addTextField(label: string, constraints: string, maxlength: number) {
    const metadata = {
      class: 'text-field',
      label: label,
      constraints: constraints,
      maxlength: maxlength
    }
    componentManager.addComponent('DynamicTextField', metadata)
  }
  
  function addDropdown(label: string, options: string[]) {
    const metadata = {
      class: 'dropdown',
      label: label,
      options: options.map((option) => ({ text: option, value: option }))
    }
    componentManager.addComponent('DynamicDropdown', metadata)
  }
  </script>
  
  <style scoped>
  .admin-page {
    padding: 20px;
  }
  
  .component-buttons {
    margin-bottom: 20px;
  }
  
  .component-buttons button {
    margin-right: 10px;
  }
  
  .component-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  </style>