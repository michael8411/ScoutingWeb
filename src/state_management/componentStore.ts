// componentStore.ts
import { defineStore } from 'pinia'
import { db } from '../composables/database'
import { collection, onSnapshot, DocumentData, updateDoc, doc } from 'firebase/firestore'

interface Component {
  id: string
  type: string
  metadata: any
  index: number
}

export const useComponentStore = defineStore('component', {
  state: () => ({
    components: [] as Component[]
  }),

  actions: {
    async addComponent(component: Component) {
      this.components.push(component)
      await this.reindexComponents()
    },

    async removeComponent(id: string) {
      this.components = this.components.filter((c) => c.id !== id)
      await this.reindexComponents()
    },

    async updateComponent(id: string, metadata: any) {
      const component = this.components.find((c) => c.id === id)
      if (component) {
        component.metadata = metadata
      }
    },

    async syncComponents() {
      const componentsRef = collection(db, 'components')
      onSnapshot(componentsRef, (snapshot) => {
        this.components = snapshot.docs
          .map((doc) => {
            const data = doc.data() as DocumentData
            return {
              id: doc.id,
              type: data.type as string,
              metadata: data.metadata,
              index: data.index as number
            }
          })
          .sort((a, b) => a.index - b.index)
      })
    },

    async reindexComponents() {
      for (let i = 0; i < this.components.length; i++) {
        const component = this.components[i]
        component.index = i
        await this.updateComponentIndex(component.id, i)
      }
    },

    async updateComponentIndex(id: string, index: number) {
      const component = this.components.find((c) => c.id === id)
      if (component) {
        component.index = index
        await updateDoc(doc(db, 'components', id), { index })
      }
    }
  }
})
