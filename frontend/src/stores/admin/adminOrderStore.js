import { makeAutoObservable } from 'mobx'
import { getAllOrders, updateOrderStatus } from '@/apis/order'

class AdminOrderStore {
  loading = false
  isListLoading = false
  orderList = []
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  getAllOrders = async (page = 1, limit = 10, search = '', filters = {}) => {
    this.isListLoading = true
    try {
      const response = await getAllOrders({
        page,
        limit,
        search,
        status: filters.status || ''
      })
      console.log('API Response:', response) // Debug log
      this.orderList = Array.isArray(response) ? response : (response.orders || [])
      console.log('Updated orderList:', this.orderList) // Debug log
      this.pagination = {
        currentPage: response.currentPage || page,
        totalPages: response.totalPages || Math.ceil(this.orderList.length / limit),
        totalItems: response.totalItems || this.orderList.length,
        itemsPerPage: limit
      }
      return true
    } catch (error) {
      console.error('Error in getAllOrders:', error) // Debug log
      throw error
    } finally {
      this.isListLoading = false
    }
  }

  updateOrderStatus = async (id, statusData) => {
    this.loading = true
    try {
      await updateOrderStatus(id, statusData)
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }
}

export default AdminOrderStore
