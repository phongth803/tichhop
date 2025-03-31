import { makeAutoObservable } from 'mobx'
import { getCategories, getCategoryById, updateCategory, deleteCategory, addCategory } from '../../apis/categories'

class AdminCategoryStore {
  loading = false
  isListLoading = false
  categoryList = []

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  getCategories = async (filter) => {
    this.isListLoading = true
    try {
      const categories = await getCategories(filter)
      this.categoryList = categories.data || []
      return true
    } catch (error) {
      throw error
    } finally {
      this.isListLoading = false
    }
  }

  addCategory = async (categoryData) => {
    this.loading = true
    try {
      await addCategory(categoryData)
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }

  deleteCategory = async (id) => {
    this.loading = true
    try {
      await deleteCategory(id)
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }

  updateCategory = async (id, categoryData) => {
    this.loading = true
    try {
      await updateCategory(id, categoryData)
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }
}

export default AdminCategoryStore
