import { makeAutoObservable } from 'mobx'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../apis/products'

export const DEFAULT_FILTERS = {
  category: '',
  search: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
  onSale: false,
  status: ''
}

class AdminProductStore {
  productsList = []
  totalProducts = 0
  currentPage = 1
  itemsPerPage = 10
  filters = DEFAULT_FILTERS
  loading = false
  isListLoading = false

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  setLoading(status) {
    this.loading = status
  }

  setListLoading(status) {
    this.isListLoading = status
  }

  setProductsList(products, total) {
    this.productsList = products
    this.totalProducts = total
  }

  setFilters = (newFilters) => {
    this.filters = { ...this.filters, ...newFilters }
    this.currentPage = 1
  }

  setPage = (page) => {
    this.currentPage = page
  }

  setItemsPerPage = (itemsPerPage) => {
    this.itemsPerPage = itemsPerPage
  }

  resetFilters = () => {
    this.filters = { ...DEFAULT_FILTERS }
    this.currentPage = 1
  }

  async getProductsList(params = {}) {
    try {
      this.setListLoading(true)
      const defaultParams = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        ...this.filters
      }
      const finalParams = { ...defaultParams, ...params, all: 'true' }
      const response = await getProducts(finalParams)
      this.setProductsList(response.data.products, response.data.pagination.totalItems)
    } catch (error) {
      console.error('Error getting products list:', error)
      this.setProductsList([], 0)
    } finally {
      this.setListLoading(false)
    }
  }

  async addProduct(productData) {
    try {
      this.setLoading(true)
      await addProduct(productData)
      return true
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  async updateProduct(id, productData) {
    try {
      this.setLoading(true)
      await updateProduct(id, productData)
      return true
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  async deleteProduct(id) {
    try {
      this.setLoading(true)
      await deleteProduct(id)
      return true
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }
}

export default AdminProductStore
