import { makeAutoObservable } from 'mobx'
import { getCategories, getCategoryById, updateCategory, deleteCategory, addCategory } from '../../apis/categories'

class AdminCategoryStore {
  loading = false
  isListLoading = false
  categoryList = []
  totalItems = 0
  currentPage = 1
  totalPages = 1

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  getCategories = async (filter) => {
    this.isListLoading = true
    try {
      const response = await getCategories(filter)
      this.categoryList = response.data.categories || []
      this.totalItems = response.data.totalItems || 0
      this.currentPage = response.data.currentPage || 1
      this.totalPages = response.data.totalPages || 1
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
