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
import AdminOrderStore from './admin/adminOrderStore'
import AdminProductStore from './admin/adminProductStore'
import OrderStore from './orderStore'
import ChatStore from './chatStore'
import StripeStore from './stripeStore'

class RootStore {
  constructor() {
    //auth
    this.authStore = new AuthStore(this)
    //admin
    this.userStore = new UserStore(this)
    this.adminCategoryStore = new AdminCategoryStore(this)
    this.adminDashBoardStore = new AdminDashBoardStore(this)
    this.orderStore = new AdminOrderStore(this)
    this.adminProductStore = new AdminProductStore(this)

    //user
    this.contactStore = new ContactStore(this)
    this.productStore = new ProductStore(this)
    this.categoryStore = new CategoryStore(this)
    this.cartStore = new CartStore(this)
    this.userOrderStore = new OrderStore(this)
    this.chatStore = new ChatStore(this)
    this.stripeStore = new StripeStore(this)
    makeAutoObservable(this)
  }
}

export const rootStore = new RootStore()

const RootStoreContext = createContext(rootStore)

export const useStore = () => useContext(RootStoreContext)

export default rootStore
