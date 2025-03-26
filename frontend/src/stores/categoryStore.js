import { makeAutoObservable } from 'mobx'
import { getCategories } from '../apis/categories'

class CategoryStore {
  categories = []
  loading = false
  error = null

  constructor() {
    makeAutoObservable(this)
  }

  setCategories(categories) {
    this.categories = categories
  }

  setLoading(status) {
    this.loading = status
  }

  setError(error) {
    this.error = error
  }

  async getCategories() {
    try {
      this.setLoading(true)
      const response = await getCategories()
      this.setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      this.setError(error)
    } finally {
      this.setLoading(false)
    }
  }
}

export default CategoryStore
