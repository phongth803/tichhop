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

  setProducts(products) {
    this.products = products
  }

  setBestSellingProducts(products) {
    this.bestSellingProducts = products
  }

  setFlashSaleProducts(products) {
    this.flashSaleProducts = products
  }

  setLoading(status) {
    this.loading = status
  }

  async getProducts(params = {}) {
    try {
      this.setLoading(true)
      const response = await getProducts(params)
      this.setProducts(response.data)
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  async getBestSellingProducts() {
    try {
      this.setLoading(true)
      const response = await getBestSellingProducts()
      this.setBestSellingProducts(response.data)
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  async getFlashSaleProducts() {
    try {
      this.setLoading(true)
      const response = await getFlashSaleProducts()
      this.setFlashSaleProducts(response.data)
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }
}

export default ProductStore
