import { makeAutoObservable } from 'mobx'
import AuthStore from './authStore'
import { createContext, useContext } from 'react'
import ContactStore from './contactStore'
import ProductStore from './productStore'
class RootStore {
  constructor() {
    this.authStore = new AuthStore(this)
    this.contactStore = new ContactStore(this)
    this.productStore = new ProductStore(this)
    makeAutoObservable(this)
  }
}

export const rootStore = new RootStore()
export const StoreContext = createContext(rootStore)
export const useStore = () => useContext(StoreContext)

export default rootStore
