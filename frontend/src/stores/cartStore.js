import { makeAutoObservable } from 'mobx'
import * as cartAPI from '../apis/cart'

class CartStore {
  cart = null
  loading = false
  itemLoadingStates = {}

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  setCart(cart) {
    this.cart = cart
  }

  setLoading(status) {
    this.loading = status
  }

  setItemLoading(productId, status) {
    this.itemLoadingStates[productId] = status
  }

  async fetchCart() {
    try {
      this.setLoading(true)
      const response = await cartAPI.getCart()
      this.setCart(response.data)
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  async addToCart(productId, quantity) {
    try {
      this.setLoading(true)
      const response = await cartAPI.addToCart(productId, quantity)
      this.setCart(response.data)
      return true
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      this.setItemLoading(productId, true)
      const response = await cartAPI.updateCartItem(productId, quantity)
      this.setCart(response.data)
      return true
    } catch (error) {
      throw error
    } finally {
      this.setItemLoading(productId, false)
    }
  }

  async removeFromCart(productId) {
    try {
      this.setItemLoading(productId, true)
      const response = await cartAPI.removeFromCart(productId)
      this.setCart(response.data)
      return true
    } catch (error) {
      throw error
    } finally {
      this.setItemLoading(productId, false)
    }
  }

  isItemLoading(productId) {
    return this.itemLoadingStates[productId] || false
  }
}

export default CartStore
