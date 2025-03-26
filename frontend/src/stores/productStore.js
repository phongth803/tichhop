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

  setProducts = (products) => {
    this.products = products
  }

  setBestSellingProducts = (products) => {
    this.bestSellingProducts = products
  }

  setFlashSaleProducts = (products) => {
    this.flashSaleProducts = products
  }

  setLoading = (status) => {
    this.loading = status
  }

  getProducts = async (params = {}) => {
    this.setLoading(true)
    try {
      const response = await getProducts(params)
      this.setProducts(response.data)
      return true
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  getBestSellingProducts = async () => {
    this.setLoading(true)
    try {
      const response = await getBestSellingProducts()
      this.setBestSellingProducts(response.data)
      return true
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  getFlashSaleProducts = async () => {
    this.setLoading(true)
    try {
      const response = await getFlashSaleProducts()
      this.setFlashSaleProducts(response.data)
      return true
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }
}

export default ProductStore
