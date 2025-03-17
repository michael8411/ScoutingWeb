<template>
  <div class="dynamic-form">
    <h2>Expense Tracker Entry</h2>
    <form @submit.prevent="handleSubmit">
      <div
        v-for="(field, index) in formSchema.fields"
        :key="field.key"
        class="form-group"
      >
        <label :for="field.key">{{ field.label }}</label>

        <!-- Text input -->
        <input
          v-if="field.type === 'text'"
          :id="field.key"
          type="text"
          v-model="formData[field.key]"
          :placeholder="field.label"
        />

        <!-- Number input -->
        <input
          v-else-if="field.type === 'number'"
          :id="field.key"
          type="number"
          v-model.number="formData[field.key]"
          :placeholder="field.label"
        />

        <!-- Dropdown select -->
        <select
          v-else-if="field.type === 'dropdown'"
          :id="field.key"
          v-model="formData[field.key]"
        >
          <option value="" disabled>-- Select --</option>
          <option
            v-for="option in field.options || []"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>

        <!-- Boolean (checkbox) -->
        <input
          v-else-if="field.type === 'boolean'"
          :id="field.key"
          type="checkbox"
          v-model="formData[field.key]"
        />

        <!-- (Add more field types as needed) -->
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'

// Define your field interface
interface FormField {
  label: string
  key: string
  type: 'text' | 'dropdown' | 'boolean' | 'number'
  options?: string[]
}

// Define the overall form schema interface
interface FormSchema {
  fields: FormField[]
}

export default defineComponent({
  name: 'DynamicForm',
  setup() {
    // Define your dynamic form schema (this can come from an API or be built dynamically)
    const formSchema = ref<FormSchema>({
      fields: [
        { label: 'Expense Description', key: 'description', type: 'text' },
        { label: 'Amount', key: 'amount', type: 'number' },
        {
          label: 'Category',
          key: 'category',
          type: 'dropdown',
          options: ['Food', 'Transport', 'Utilities', 'Other'],
        },
        { label: 'Reimbursable', key: 'reimbursable', type: 'boolean' },
        // Add more fields if needed
      ],
    })

    // Create reactive object for form data.
    // Initialize each field based on its type.
    const formData = reactive<{ [key: string]: any }>({})
    formSchema.value.fields.forEach((field) => {
      formData[field.key] = field.type === 'boolean' ? false : ''
    })

    // Replace with your deployed Google Apps Script Web App URL.
    // See instructions below on how to deploy your script.
    const scriptUrl =
      'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'

    // Function to handle form submission.
    const handleSubmit = async () => {
      try {
        // Post the formData as JSON to your Google Apps Script endpoint.
        await fetch(scriptUrl, {
          method: 'POST',
          // mode: 'no-cors' is sometimes needed for Google Web Apps, but note that it may limit access to response details.
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        console.log('Form submitted successfully')

        // Clear form data after submission.
        formSchema.value.fields.forEach((field) => {
          formData[field.key] = field.type === 'boolean' ? false : ''
        })
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }

    return {
      formSchema,
      formData,
      handleSubmit,
    }
  },
})
</script>

<style scoped>
.dynamic-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.25rem;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}
</style>
