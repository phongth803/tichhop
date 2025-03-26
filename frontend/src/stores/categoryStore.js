import { makeAutoObservable } from 'mobx'
import { getCategories } from '../apis/categories'

class CategoryStore {
  categories = []
  loading = false

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  setCategories(categories) {
    this.categories = categories
  }

  setLoading(status) {
    this.loading = status
  }

  async getCategories() {
    try {
      this.setLoading(true)
      const response = await getCategories()
      this.setCategories(response.data)
    } catch (error) {
      throw error
    } finally {
      this.setLoading(false)
    }
  }
}

export default CategoryStore
