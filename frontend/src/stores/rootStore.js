import { makeAutoObservable } from 'mobx'
import AuthStore from './authStore'
import { createContext, useContext } from 'react'
import ContactStore from './contactStore'
import ProductStore from './productStore'
import CategoryStore from './categoryStore'
import UserStore from './admin/userStore'
import CartStore from './cartStore'
import AdminCategoryStore from './admin/adminCategoryStore'
import AdminDashBoardStore from './admin/adminDashBoardStore'

class RootStore {
  constructor() {
    //auth
    this.authStore = new AuthStore(this)
    //admin
    this.userStore = new UserStore(this)
    this.adminCategoryStore = new AdminCategoryStore(this)
    this.adminDashBoardStore = new AdminDashBoardStore(this)

    //user
    this.contactStore = new ContactStore(this)
    this.productStore = new ProductStore(this)
    this.categoryStore = new CategoryStore(this)
    this.cartStore = new CartStore(this)
    makeAutoObservable(this)
  }
}

export const rootStore = new RootStore()
export const StoreContext = createContext(rootStore)
export const useStore = () => useContext(StoreContext)

export default rootStore
