import { makeAutoObservable } from 'mobx'
import {
  getProducts,
  getBestSellingProducts,
  getFlashSaleProducts,
  getProduct,
  getRelatedProducts
} from '../apis/products'

class ProductStore {
  products = []
  bestSellingProducts = []
  flashSaleProducts = []
  currentProduct = null
  relatedProducts = []
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

  setCurrentProduct(product) {
    this.currentProduct = product
  }

  setRelatedProducts(products) {
    this.relatedProducts = products
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

  async getProductDetail(id) {
    try {
      this.setLoading(true)
      const response = await getProduct(id)
      this.setCurrentProduct(response.data)

      if (response.data.category) {
        this.getRelatedProductsByCategory(id, response.data.category._id)
      }
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  async getRelatedProductsByCategory(productId, categoryId) {
    try {
      this.setLoading(true)
      const response = await getRelatedProducts(productId, categoryId)
      this.setRelatedProducts(response.data)
    } catch (error) {
      this.setRelatedProducts([])
    } finally {
      this.setLoading(false)
    }
  }
}

export default ProductStore
