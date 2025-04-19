import { makeAutoObservable } from 'mobx'
import { getUserOrders, createOrder, cancelOrder } from '../apis/order'

class OrderStore {
  orders = []
  loading = false
  error = null
  currentFilter = ''

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

  setCurrentFilter = (filter) => {
    this.currentFilter = filter
  }

  fetchOrders = async (status = null) => {
    this.setLoading(true)
    this.setError(null)
    try {
      const filterToUse = status === null ? this.currentFilter : status === '' ? '' : status
      const data = await getUserOrders({ status: filterToUse })
      this.setOrders(data)
      this.setCurrentFilter(filterToUse)
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

  cancelOrder = async (orderId) => {
    this.setLoading(true)
    this.setError(null)
    try {
      const response = await cancelOrder(orderId)
      await this.fetchOrders()
      return response
    } catch (error) {
      this.setError(error.message)
      console.error('Error cancelling order:', error)
      throw error
    } finally {
      this.setLoading(false)
    }
  }
}

export default OrderStore
