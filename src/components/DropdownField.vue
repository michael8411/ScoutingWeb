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
  flex-direction: column;
  align-items: baseline;
  justify-content: bottom;
  width: 100%;
  gap: clamp(5px, 1vw, 10px);
  height: 75px;
}

.dropdown-label {
  font-size: clamp(16px, 1.8vw, 22px);
  font-weight: 400;
  white-space: nowrap;
}

.dynamic-dropdown {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.dropdown-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(8px, 1.5vw, 12px);
  background-color: #1e1e1e;
  box-shadow: 0px 4px 4px 0px rgba(43, 43, 43, 0.25);
  color: #fff;
  border-radius: 15px;
  cursor: pointer;
  user-select: none;
  height: clamp(40px, 6vw, 50px);
  width: 100%;
}

.dropdown-selected {
  color: #989898;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(16px, 1.65vw, 20px);
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.dropdown-arrow {
  width: 0;
  height: 0;
  border-left: clamp(4px, 0.8vw, 5px) solid transparent;
  border-right: clamp(4px, 0.8vw, 5px) solid transparent;
  border-top: clamp(4px, 0.8vw, 5px) solid #989898;
  transition: transform 0.3s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-options {
  position: relative;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #1e1e1e;
  border-radius: 15px;
  margin-top: clamp(3px, 0.5vw, 5px);
  padding: 0;
  list-style: none;
  width: 100%;
}

.dropdown-option {
  position: relative;
  padding: clamp(8px, 1.5vw, 12px);
  cursor: pointer;
}

.dropdown-option:hover {
  background-color: #131313;
  border-radius: 15px;
}



</style>
