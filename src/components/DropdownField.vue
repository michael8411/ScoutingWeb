<!-- Dropdown.vue -->
<template>
  <div class="dynamic-dropdown-wrapper">
    <label v-if="metadata.label" class="dropdown-label">{{ metadata.label }}</label>
    <div class="dynamic-dropdown" :class="metadata.class">
      <div class="dropdown-container" @click="toggleDropdown">
        <div class="dropdown-selected">
          {{ selectedOption ? selectedOption.text : 'Select an option' }}
        </div>
        <div class="dropdown-arrow" :class="{ open: isOpen }"></div>
      </div>
      <ul v-show="isOpen" class="dropdown-options">
        <li
          v-for="option in metadata.options"
          :key="option.value"
          @click="selectOption(option)"
          class="dropdown-option"
        >
          {{ option.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { useComponentStore } from '../state_management/componentStore'
import { defineComponent, computed, ref, onMounted } from 'vue'

interface DropdownOption {
  text: string
  value: string
}

interface DropdownMetadata {
  class?: string
  label?: string
  options: DropdownOption[]
  defaultValue?: string
}

export default defineComponent({
  name: 'DynamicDropdown',
  props: {
    componentId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const componentStore = useComponentStore()
    const isOpen = ref(false)
    const selectedOption = ref<DropdownOption | null>(null)

    const metadata = computed<DropdownMetadata>(() => {
      const component = componentStore.components.find((c) => c.id === props.componentId)
      return component ? component.metadata : { options: [] }
    })

    function toggleDropdown() {
      isOpen.value = !isOpen.value
    }

    function selectOption(option: DropdownOption) {
      selectedOption.value = option
      isOpen.value = false
      componentStore.updateComponent(props.componentId, {
        ...metadata.value,
        defaultValue: option.value
      })
    }

    onMounted(() => {
      const defaultValue = metadata.value.defaultValue
      if (defaultValue) {
        const defaultOption = metadata.value.options.find((option) => option.value === defaultValue)
        if (defaultOption) {
          selectedOption.value = defaultOption
        }
      }
    })

    return {
      metadata,
      isOpen,
      selectedOption,
      toggleDropdown,
      selectOption
    }
  }
})
</script>

<style scoped>
.dynamic-dropdown-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: bottom;
  width: 100%;
  gap: 50px;
}

.dropdown-label {
  margin-right: 10px;
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

.dynamic-dropdown {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.dropdown-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #1e1e1e;
  box-shadow: 0px 4px 4px 0px rgba(43, 43, 43, 0.25);
  color: #fff;
  border-radius: 15px;
  cursor: pointer;
  user-select: none;
  height: 50px;
  width: 260px;
}

.dropdown-selected {
  color: #989898;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.dropdown-arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #989898;
  transition: transform 0.3s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-options {
  position: relative;
  bottom: 100%; /* Positioned at the bottom edge of the dropdown-container */
  left: 0;
  right: 0;
  background-color: #1e1e1e;
  border-radius: 15px;
  margin-top: 5px; /* Add margin to move it below the container */
  padding: 0;
  list-style: none;
  width: 100%;
}
.dropdown-option {
  position: relative;
  padding: 10px;
  cursor: pointer;
}

.dropdown-option:hover {
  background-color: #131313;
  border-radius: 15px;
}

@media screen and (max-width: 600px) {
  .dynamic-dropdown {
    width: 100%;
  }
}
</style>
