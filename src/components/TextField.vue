<!-- Textfield.vue -->
<template>
  <div class="dynamic-textfield-wrapper">
    <label v-if="metadata.label" class="textfield-label">{{ metadata.label }}</label>
    <div class="dynamic-textfield" :class="metadata.class">
      <input
        :title="metadata.title"
        :maxlength="metadata.maxlength"
        v-model="inputText"
        @input="handleInput"
        @keypress="handleKeypress"
      />
      <label class="maxChar"> {{ inputText.length }}/{{ metadata.maxlength }} </label>
    </div>
    <p>{{ validationStatusMessage }}</p>
  </div>
</template>

<script lang="ts">
import { useComponentStore } from '../state_management/componentStore'
import { defineComponent, computed, ref, onMounted, watch } from 'vue'

interface TextFieldMetadata {
  class?: string
  label?: string
  filterFile?: string[]
  maxlength?: number
  title?: string
  constraints?: string
  initialValue?: string
  reset?: boolean
  resetBehavior?: string
}

export default defineComponent({
  name: 'DynamicTextField',
  props: {
    componentId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const componentStore = useComponentStore()
    const inputText = ref('')
    const validationStatusMessage = ref('')

    const metadata = computed<TextFieldMetadata>(() => {
      const component = componentStore.components.find((c) => c.id === props.componentId)
      return component ? component.metadata : {}
    })

    onMounted(() => {
      inputText.value = metadata.value.initialValue || ''
    })

    watch(
      () => metadata.value.reset,
      (newVal) => {
        if (newVal) resetField()
      }
    )

    watch(inputText, (newValue) => {
      handleConstraints(newValue)
      handleMaxLength(newValue)
      handleFilterFile(newValue)
      updateComponentStore(newValue)
    })

    function handleInput(event: Event) {
      const target = event.target as HTMLInputElement
      applyConstraints(target.value)
    }

    function handleKeypress(event: KeyboardEvent) {
      if (event.key === 'Enter') event.preventDefault()
    }

    function handleConstraints(newValue: string) {
      switch (metadata.value.constraints) {
        case 'Initials':
          inputText.value = validateInitials(newValue)
          break
        case 'Letters':
          inputText.value = newValue.replace(/[^a-zA-Z]/g, '')
          break
        case 'Text':
          inputText.value = newValue.replace(/[^a-zA-Z0-9\s,.;()'"/?!]/g, '')
          break
        case 'Numbers':
          inputText.value = newValue.replace(/\D/g, '')
          break
        default:
          inputText.value = newValue
      }
    }

    function resetField() {
      switch (metadata.value.resetBehavior) {
        case 'preserve':
          break
        case 'increment':
          inputText.value = (parseInt(inputText.value) + 1).toString()
          break
        default:
          inputText.value = ''
      }
      updateComponentStore(inputText.value)
    }

    function applyConstraints(newValue: string) {
      switch (metadata.value.constraints) {
        case 'Initials':
          inputText.value = validateInitials(newValue)
          break
        case 'Letters':
          inputText.value = newValue.replace(/[^a-zA-Z]/g, '')
          break
        case 'Text':
          inputText.value = newValue.replace(/[^a-zA-Z0-9\s,.;()'"/?!]/g, '')
          break
        case 'Numbers':
          inputText.value = newValue.replace(/\D/g, '')
          break
        default:
          inputText.value = newValue
      }
    }

    function handleMaxLength(newValue: string) {
      if (newValue.length === metadata.value.maxlength) {
        inputText.value = newValue.toUpperCase()
      }
    }

    function handleFilterFile(newValue: string) {
      if (metadata.value.filterFile && !metadata.value.filterFile.includes(newValue)) {
        validationStatusMessage.value = `Invalid ${metadata.value.label}`
      } else {
        validationStatusMessage.value = `Valid ${metadata.value.label}`
      }
    }

    function validateInitials(newValue: string) {
      return /^[a-zA-Z]*$/.test(newValue) ? newValue : newValue.slice(0, -1)
    }

    function updateComponentStore(value: string) {
      componentStore.updateComponent(props.componentId, {
        ...metadata.value,
        initialValue: value
      })
    }

    return {
      metadata,
      inputText,
      validationStatusMessage,
      handleInput,
      handleKeypress
    }
  }
})
</script>

<style scoped>
.dynamic-textfield-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-height: 70px;
  gap: clamp(5px, 1vw, 10px);
}

.textfield-label {
  font-size: clamp(16px, 1.8vw, 22px);
  font-weight: 400;
  white-space: nowrap;
}

.dynamic-textfield {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.dynamic-textfield input {
  width: 100%;
  padding: clamp(8px, 1.5vw, 12px);
  border: 2px solid #989898;
  border-radius: 8px;
  font-size: clamp(14px, 2vw, 20px);
  background-color: transparent;
  color: #989898;
  font-family: 'Manrope', sans-serif;
}

.maxChar {
  position: absolute;
  bottom: clamp(-20px, -2.5vw, -16px);
  right: 0;
  font-size: clamp(10px, 1.5vw, 12px);
  color: #888;
}

@media screen and (max-width: 600px) {
  .dynamic-textfield-wrapper {
    gap: px;
  }

  .textfield-label {
    font-size: 16px;
  }

  .dynamic-textfield input {
    font-size: 14px;
  }
}
</style>
