import { makeAutoObservable } from 'mobx'
import {
  getProducts,
  getBestSellingProducts,
  getFlashSaleProducts,
  getProduct,
  getRelatedProducts,
  addProductRating,
  getMyRatings,
  updateRating,
  deleteRating
} from '../apis/products'

export const DEFAULT_FILTERS = {
  category: '',
  search: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
  onSale: false
}

class ProductStore {
  productsList = []
  totalProducts = 0
  currentPage = 1
  filters = DEFAULT_FILTERS

  exploreProducts = []
  bestSellingProducts = []
  flashSaleProducts = []
  myRatings = []

  currentProduct = null
  relatedProducts = []

  loadingStates = {
    products: false,
    explore: false,
    bestSelling: false,
    flashSale: false,
    detail: false,
    related: false,
    rating: false,
    myRatings: false
  }

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  setLoadingState(key, status) {
    this.loadingStates[key] = status
  }

  setProductsList(products, total) {
    this.productsList = products
    this.totalProducts = total
  }

  setExploreProducts(products) {
    this.exploreProducts = products
  }

  setBestSellingProducts(products) {
    this.bestSellingProducts = products
  }

  setFlashSaleProducts(products) {
    this.flashSaleProducts = products
  }

  setCurrentProduct(product) {
    this.currentProduct = product
  }

  setRelatedProducts(products) {
    this.relatedProducts = products
  }

  setFilters = (newFilters) => {
    this.filters = { ...this.filters, ...newFilters }
    this.currentPage = 1
  }

  setPage = (page) => {
    this.currentPage = page
  }

  resetFilters = () => {
    this.filters = { ...DEFAULT_FILTERS }
    this.currentPage = 1
  }

  setMyRatings(ratings) {
    this.myRatings = ratings
  }

  async getProductsList() {
    try {
      this.setLoadingState('products', true)
      const params = {
        page: this.currentPage,
        limit: 20,
        ...this.filters
      }
      const response = await getProducts(params)
      this.setProductsList(response.data.products, response.data.pagination.totalItems)
    } catch (error) {
      console.error('Error getting products list:', error)
      this.setProductsList([], 0)
    } finally {
      this.setLoadingState('products', false)
    }
  }

  async getExploreProducts() {
    try {
      this.setLoadingState('explore', true)
      const response = await getProducts({ limit: 24 })
      this.setExploreProducts(response.data.products)
    } catch (error) {
      console.error('Error getting explore products:', error)
      this.setExploreProducts([])
    } finally {
      this.setLoadingState('explore', false)
    }
  }

  async getBestSellingProducts() {
    try {
      this.setLoadingState('bestSelling', true)
      const response = await getBestSellingProducts()
      this.setBestSellingProducts(response.data)
    } catch (error) {
      console.error('Error getting best selling products:', error)
      this.setBestSellingProducts([])
    } finally {
      this.setLoadingState('bestSelling', false)
    }
  }

  async getFlashSaleProducts() {
    try {
      this.setLoadingState('flashSale', true)
      const response = await getFlashSaleProducts()
      this.setFlashSaleProducts(response.data)
    } catch (error) {
      console.error('Error getting flash sale products:', error)
      this.setFlashSaleProducts([])
    } finally {
      this.setLoadingState('flashSale', false)
    }
  }

  async getProductDetail(id) {
    try {
      this.setLoadingState('detail', true)
      const response = await getProduct(id)
      this.setCurrentProduct(response.data)

      if (response.data.category) {
        await this.getRelatedProducts(id, response.data.category._id)
      }
    } catch (error) {
      console.error('Error getting product detail:', error)
      this.setCurrentProduct(null)
    } finally {
      this.setLoadingState('detail', false)
    }
  }

  async getRelatedProducts(productId, categoryId) {
    try {
      this.setLoadingState('related', true)
      const response = await getRelatedProducts(productId, categoryId)
      this.setRelatedProducts(response.data)
    } catch (error) {
      console.error('Error getting related products:', error)
      this.setRelatedProducts([])
    } finally {
      this.setLoadingState('related', false)
    }
  }

  addRating = async (productId, ratingData) => {
    try {
      this.setLoadingState('rating', true)
      const response = await addProductRating(productId, ratingData)
      await this.getProductDetail(productId)
      return response
    } catch (error) {
      console.error('Error adding rating:', error)
      throw error
    } finally {
      this.setLoadingState('rating', false)
    }
  }

  async fetchMyRatings() {
    try {
      this.setLoadingState('myRatings', true)
      const response = await getMyRatings()
      this.setMyRatings(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error getting my ratings:', error)
      this.setMyRatings([])
      throw error
    } finally {
      this.setLoadingState('myRatings', false)
    }
  }

  async updateRating(ratingId, ratingData) {
    try {
      this.setLoadingState('rating', true)
      const response = await updateRating(ratingId, ratingData)
      await this.fetchMyRatings() // Refresh ratings list
      if (this.currentProduct) {
        await this.getProductDetail(this.currentProduct._id) // Refresh current product if viewing
      }
      return response
    } catch (error) {
      console.error('Error updating rating:', error)
      throw error
    } finally {
      this.setLoadingState('rating', false)
    }
  }

  async deleteRating(ratingId) {
    try {
      this.setLoadingState('rating', true)
      const response = await deleteRating(ratingId)
      await this.fetchMyRatings() // Refresh ratings list
      if (this.currentProduct) {
        await this.getProductDetail(this.currentProduct._id) // Refresh current product if viewing
      }
      return response
    } catch (error) {
      console.error('Error deleting rating:', error)
      throw error
    } finally {
      this.setLoadingState('rating', false)
    }
  }
}

export default ProductStore
