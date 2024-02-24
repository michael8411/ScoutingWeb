import { defineStore } from 'pinia';

export const useFormStore = defineStore('formStore', {
  state: () => ({
    submissionData: new Map(),
  }),

  actions: {
    setValue(key: any, value: any) {
      this.submissionData.set(key, value);
    },
    getValue(key: any) {
      return this.submissionData.get(key);
    },
    deleteValue(key: any) {
      this.submissionData.delete(key);
    },
    clearValues() {
      this.submissionData.clear();
    },
    reset() {
      this.submissionData.clear();
    },
    validate() {
      for (const [key, value] of this.submissionData.entries()) {
        if (!value) return false;
      }
      return true;
    }
  },
});
