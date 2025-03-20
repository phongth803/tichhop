import { makeAutoObservable } from 'mobx'
import AuthStore from './AuthStore'
import { createContext, useContext } from 'react'
import ContactStore from './contactStore'

class RootStore {
  constructor() {
    this.authStore = new AuthStore(this)
    this.contactStore = new ContactStore(this)
    makeAutoObservable(this)
  }
}

const rootStore = new RootStore()

// Create a React context for the store
const StoreContext = createContext(rootStore)

// Create a hook to use the store
export const useStore = () => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return store
}

export default rootStore
