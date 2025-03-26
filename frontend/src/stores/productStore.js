import { makeAutoObservable } from 'mobx'
import { getProducts, getBestSellingProducts, getFlashSaleProducts } from '../apis/products'

class ProductStore {
  products = []
  bestSellingProducts = []
  flashSaleProducts = []
  loading = false

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  getProducts = async (params = {}) => {
    this.loading = true
    try {
      const response = await getProducts(params)
      this.products = response.data
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }

  getBestSellingProducts = async () => {
    this.loading = true
    try {
      const response = await getBestSellingProducts()
      this.bestSellingProducts = response.data
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }

  getFlashSaleProducts = async () => {
    this.loading = true
    try {
      const response = await getFlashSaleProducts()
      this.flashSaleProducts = response.data
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }
}

export default ProductStore
