// ComponentManager.ts
import { useComponentStore } from '../state_management/componentStore'
import { db } from '../composables/database'
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'

class ComponentManager {
  async addComponent(type: string, metadata: any) {
    const componentStore = useComponentStore()
    const id = this.generateComponentId()
    const index = componentStore.components.length
    const component = { id, type, metadata, index }
    componentStore.addComponent(component)
    await setDoc(doc(db, 'components', id), { type, metadata, index })
  }

  async updateComponent(id: string, metadata: any) {
    const componentStore = useComponentStore()
    componentStore.updateComponent(id, metadata)
    await updateDoc(doc(db, 'components', id), { metadata })
  }

  async removeComponent(id: string) {
    const componentStore = useComponentStore()
    componentStore.removeComponent(id)
    await deleteDoc(doc(db, 'components', id))
  }

  private generateComponentId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

export const componentManager = new ComponentManager()
