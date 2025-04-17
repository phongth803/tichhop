import { makeAutoObservable } from 'mobx'
import { getUserOrders, createOrder } from '../apis/order'

class OrderStore {
  orders = []
  loading = false
  error = null

  constructor() {
    makeAutoObservable(this)
  }

  setLoading = (loading) => {
    this.loading = loading
  }

  setError = (error) => {
    this.error = error
  }

  setOrders = (orders) => {
    this.orders = orders
  }

  fetchOrders = async (status = '') => {
    this.setLoading(true)
    this.setError(null)
    try {
      const data = await getUserOrders({ status })
      this.setOrders(data)
    } catch (error) {
      this.setError(error.message)
      console.error('Error fetching orders:', error)
    } finally {
      this.setLoading(false)
    }
  }

  createOrder = async (orderData) => {
    this.setLoading(true)
    this.setError(null)
    try {
      const response = await createOrder(orderData)
      return response
    } catch (error) {
      this.setError(error.message)
      console.error('Error creating order:', error)
      throw error
    } finally {
      this.setLoading(false)
    }
  }
}

export default OrderStore
